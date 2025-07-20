# Étape 1 : Base image Node
FROM node:lts-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Lancer l'application en mode dev
CMD ["npm", "run", "dev"]