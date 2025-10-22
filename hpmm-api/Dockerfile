# Etapa 1: Build
FROM node:22-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo dev para compilar)
RUN npm ci && npm cache clean --force

# Copiar el código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# Etapa 2: Producción
FROM node:22-alpine

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción desde builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar el código compilado
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copiar archivos de migraciones (Knex los necesita en formato .ts)
COPY --from=builder --chown=nodejs:nodejs /app/src/db ./src/db

# Copiar knexfile para migraciones
COPY --from=builder --chown=nodejs:nodejs /app/src/knexfile.ts ./src/knexfile.ts

# Copiar archivos necesarios
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Copiar certificados SSL si existen
COPY --chown=nodejs:nodejs certs ./certs

# Cambiar al usuario no-root
USER nodejs

# Exponer el puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para manejar señales
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/server.js"]
