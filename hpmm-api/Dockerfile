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

# Instalar dumb-init y curl para manejar señales correctamente y health checks
RUN apk add --no-cache dumb-init curl

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


# Copiar certificados SSL y convertir a formato Unix (LF)
COPY --chown=nodejs:nodejs certs ./certs
RUN apk add --no-cache dos2unix && \
  dos2unix ./certs/cert.pem ./certs/key.pem



# Forzar UTF-8 y locales correctos en todo el entorno
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8
ENV PYTHONIOENCODING=utf-8

# Cambiar al usuario no-root
USER nodejs


# Exponer el puerto real del backend
EXPOSE 8443

# Healthcheck simplificado para evitar problemas de encoding
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -k -f https://127.0.0.1:8443/health || exit 1

# Usar dumb-init para manejar señales
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/server.js"]
