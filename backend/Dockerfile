FROM node:lts-alpine

WORKDIR /app

# Copie des dépendances et installation
COPY package*.json ./
RUN npm install

# Copie du code
COPY . .
COPY .env.exemple .env

# Expose le port du serveur
EXPOSE 4000

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]
