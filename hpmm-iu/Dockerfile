# Etapa 1: Build
FROM node:22-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci && npm cache clean --force

# Copiar el código fuente
COPY . .

# Argumento para la URL de la API (se pasa desde docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar certificados SSL si existen
COPY certs /etc/nginx/certs

# Exponer puertos HTTP y HTTPS
EXPOSE 80 443

# Healthcheck (verifica HTTPS)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider --no-check-certificate https://localhost:443/ || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
