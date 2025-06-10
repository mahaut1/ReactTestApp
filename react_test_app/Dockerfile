# Utilise une image officielle Node.js
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Ajouter .bin au PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copier uniquement les fichiers nécessaires pour les dépendances (meilleure gestion du cache Docker)
COPY package.json ./
COPY package-lock.json ./

# Utiliser npm ci pour des builds plus rapides et plus fiables
RUN npm ci --verbose

# (Facultatif) Installer react-scripts globalement si nécessaire — à éviter si c'est une dépendance locale
# RUN npm install -g react-scripts@5.0.1 --silent

# Copier le reste du code (après avoir installé les deps)
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application (React)
CMD ["npm", "start"]
