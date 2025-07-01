import express from "express";

import router from "./routes/index.js";

import errorMiddleware from "./middlewares/errorsMiddleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorMiddleware);

export default app;
