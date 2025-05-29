# Project structure

project-root/
│
├── services/
│ ├── users-service/
│ │ ├── controllers/ # Contrôleurs Express pour users
│ │ ├── views/ # Templates EJS
│ │ ├── routes/ # Fichiers de routes Express
│ │ ├── app.js # Point d'entrée de l'application
│ │ └── package.json # Dépendances spécifiques au service
│ │
│ └── products-service/
│ ├── controllers/ # Contrôleurs Express pour produits
│ ├── views/ # (Optionnel ici si API only)
│ ├── routes/ # Fichiers de routes Express
│ ├── app.js # Point d'entrée
│ └── package.json # Dépendances spécifiques au service
│
├── docker-compose.yml # Configuration Docker multi-service
└── README.md # Documentation du projet
