import express from "express";
// import router from "./routers/transfersRouter";
// import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(router);

// app.use(errorMiddleware);

export default app;