# Étape de build
FROM node:20-alpine as builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY bun.lockb ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copie des fichiers de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]