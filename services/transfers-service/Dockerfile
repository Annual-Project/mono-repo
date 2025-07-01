FROM node:22-alpine

# Crée le dossier de travail principal
WORKDIR /app

# Copy le mono-repo en entier
COPY . ./

# Install les packages nécessaires pour l'os
# apk est le gestionnaire de paquets Alpine.
# --no-cache évite de stocker les index de paquets localement (utile dans des conteneurs).
# openssl est disponible dans les dépôts Alpine de base.
RUN apk add --no-cache openssl

# Install dependencies using workspaces
RUN npm install --workspaces

# Va dans ce chemin depuis la racine du mono-repo
WORKDIR /app/services/transfers-service

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
