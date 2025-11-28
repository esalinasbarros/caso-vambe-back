# Imagen base liviana de Node.js Alpine
FROM node:20-alpine

# Instalar dependencias del sistema necesarias para better-sqlite3
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar código fuente
COPY . .

# Crear directorio para la base de datos
RUN mkdir -p data

# Compilar TypeScript
RUN npm run build

# Limpiar node_modules y reinstalar solo producción
RUN rm -rf node_modules && npm ci --only=production

# Exponer puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]

