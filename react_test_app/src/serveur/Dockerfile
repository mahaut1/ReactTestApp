# Utilise une image officielle de Python comme image de base
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /serveur

# Copier les fichiers requis dans le conteneur
COPY ./ /serveur

# Mettre à jour pip et installer les dépendances
RUN python -m pip install --upgrade pip \
    && pip install \
       fastapi \
       uvicorn[standard] \
       pydantic[email] \
       email-validator \
       mysql-connector-python \
       passlib[bcrypt]

# Exposer le port utilisé par l'application FastAPI
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["uvicorn", "serveur:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]
