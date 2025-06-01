# Utilise une image officielle de Python comme image de base
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /serveur

# Copier les fichiers requis dans le conteneur
COPY ./ /serveur

# Installer les dépendances
RUN pip install mysql-connector-python fastapi uvicorn passlib[bcrypt] pydantic[email]

# Exposer le port utilisé par l'application FastAPI
EXPOSE 8000

# Commande pour démarrer l'application
CMD uvicorn serveur:app --proxy-headers --host 0.0.0.0 --port 8000
