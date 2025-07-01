# Project structure

project/
└── services/
    ├── auth-service/
      ├── package.json
      ├── Dockerfile
      └── ...
    ├── products-service/
      ├── package.json
      ├── Dockerfile
      └── ...
└── shared/
    ├── config/
      └── redis.js
    └── stores/
    ├   ├── permissionsStore.js
    ├   ├── sessionStore.js
    ├   └── ...
    └── package.json
└── docker-compose.yml
└── package.json
└── node_modules/
└── .gitignore
