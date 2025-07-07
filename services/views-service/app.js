import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";

import router from "./routes/index.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import errorMiddleware from "./middlewares/errorsMiddleware.js";

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'development'
    ? '*'
    : 'https://skillforge.keyce.fr',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(authMiddleware);

app.use(router);

app.use(errorMiddleware);

export default app;
