FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

# COPY . .

EXPOSE 3000

# Faire tourner le container a l'infini car il se stop s'il n'y a rien dedans
ENTRYPOINT [ "tail", "-f", "/dev/null" ]
