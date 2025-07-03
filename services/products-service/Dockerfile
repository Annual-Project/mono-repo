FROM node:22-alpine

# Crée le dossier de travail principal
WORKDIR /app

# Utile seulement en production (quand le volume sera supprimé du docker-compose)
# COPY package*.json ./
# COPY services ./services
# COPY shared ./shared

# Install les packages nécessaires pour l'os
# apk est le gestionnaire de paquets Alpine.
# --no-cache évite de stocker les index de paquets localement (utile dans des conteneurs).
# openssl est disponible dans les dépôts Alpine de base.
RUN apk add --no-cache openssl

# Utile seulement en production (quand le volume sera supprimé du docker-compose)
# Install dependencies using workspaces
# RUN npm install --workspaces

# Utile seulement en production (quand le volume sera supprimé du docker-compose)
# RUN npm ci

# Va dans ce chemin depuis la racine du mono-repo
WORKDIR /app

ENTRYPOINT [ "tail", "-f", "/dev/null" ]