import express from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import "dotenv/config";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/routes";     // tus rutas /users
import { errorHandler } from "./utils/errorHandler";
import session from "express-session";
import Redis from "ioredis";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";

// CORS origins - Soporta múltiples orígenes desde variable de entorno y permite DNS interno (Cloud Map) e IP privada
const FRONTEND_ORIGINS = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      "https://cfra2.com", // Producción
      "https://api.cfra2.com", // API Producción
      "https://web.cfra2.com", // Frontend Producción
      "https://localhost:5173",  // Desarrollo
      "http://localhost:5173"   // Desarrollo
    ];

// Regex para permitir DNS internos (*.local, *.namespace) y rangos de IP privadas
const INTERNAL_DNS_REGEX = /^(https?:\/\/)?([\w-]+\.)*(local|hpmm-almacen-namespace)(:\d+)?$/;
const PRIVATE_IP_REGEX = /^(https?:\/\/)?(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/;

const corsOptions: CorsOptions = {
  origin: function(origin, callback) {
    console.log('[CORS DEBUG] Origin recibido:', origin);
    // Permitir sin origin (curl, Postman, health checks)
    if (!origin) return callback(null, true);
    if (
      FRONTEND_ORIGINS.includes(origin) ||
      INTERNAL_DNS_REGEX.test(origin) ||
      PRIVATE_IP_REGEX.test(origin)
    ) {
      return callback(null, true);
    } else {
      console.log('[CORS DEBUG] Origin NO permitido:', origin);
      return callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
};

const app = express();

// Si estás detrás de un ALB / proxy, habilitar trust proxy para cookies secure
// y para que express detecte correctamente HTTPS
app.set("trust proxy", true);

// CORS: usar middleware y asegurar respuesta a OPTIONS
app.use(cors(corsOptions));
// Responder explicitamente OPTIONS para cualquier ruta (preflight)
app.options("*", cors(corsOptions));

// Paseo de JSON, cookies y seguridad
app.use(express.json());
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

// DEBUG: log de requests y origen para verificar preflight (quitar en prod si prefieres)
app.use((req, res, next) => {
  console.log(`[CORS DEBUG] ${req.method} ${req.originalUrl} Origin: ${req.headers.origin}`);
  next();
});

// Configuración de Redis (opcional en desarrollo)
let redisClient: Redis | null = null;
let RedisStoreConstructor: any = undefined;

const SKIP_REDIS = process.env.SKIP_REDIS === 'true' || process.env.NODE_ENV === 'development';

if (!SKIP_REDIS) {
  redisClient = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL)
    : new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        password: process.env.REDIS_PASSWORD,
      });

  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  redisClient.on("connect", () => {
    console.log("✅ Connected to Redis successfully");
  });

  RedisStoreConstructor = new RedisStore({
    client: redisClient,
    prefix: "sess:"
  });
  console.log("🔴 Redis store configured");
} else {
  console.log("⚠️  Redis desactivado - usando sesiones en memoria (desarrollo solo)");
}

app.use(
  session({
    store: RedisStoreConstructor,
    secret: process.env.SESSION_SECRET || "unSecretoMuyFuerte",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure debe ser true en producción para usar cookies solo sobre HTTPS
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 8, // 8 horas
    },
  })
);

// Health check endpoint para ECS
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// monta tus rutas **públicas** y protegidas de Auth:
app.use('/api/auth', authRouter);

// monta todas las otras rutas de tu monolito (users, roles, etc):
app.use('/api', userRouter);

// manejador de errores al final
app.use(errorHandler);

export default app;