FROM node:slim

# Crée le dossier de travail principal
WORKDIR /app

# Copy le mono-repo en entier
COPY . ./

# Install les packages nécessaires pour l'os
RUN apt-get update -y && apt-get install -y openssl

# Install dependencies using workspaces
RUN npm install --workspaces

# Va dans ce chemin depuis la racine du mono-repo
WORKDIR /app/services/products-service

ENTRYPOINT [ "tail", "-f", "/dev/null" ]

