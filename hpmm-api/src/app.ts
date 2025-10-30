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

// CORS origins - Soporta múltiples orígenes desde variable de entorno
const FRONTEND_ORIGINS = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      "https://cfra2.com", // Producción
      "https://api.cfra2.com", // API Producción
      "https://web.cfra2.com", // Frontend Producción
      "https://localhost:5173",  // Desarrollo
      "http://localhost:5173"   // Desarrollo
    ];

const corsOptions: CorsOptions = {
  origin: FRONTEND_ORIGINS, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
};

const app = express();

// CROS y Helmet
app.use(cors(corsOptions));

// Paseo de JSON, cookies y seguridad
app.use(express.json());
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

// Configuración de Redis (soporta tanto local como Upstash)
const redisClient = process.env.REDIS_URL 
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
  console.log("Connected to Redis successfully");
});

// 2) Configuramos connect-redis como store de express-session
const RedisStoreConstructor = new RedisStore({
      client: redisClient,
      prefix: "sess:"
    });

app.use(
  session({
    store: RedisStoreConstructor,
    secret: process.env.SESSION_SECRET || "unSecretoMuyFuerte",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
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