import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";

import errorMiddleware from './middlewares/errors.js';
import router from './routes/index.js';
import authMiddleware from "./middlewares/auth.js";

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

app.use(authMiddleware);

app.use(router);

app.use(errorMiddleware);

export default app;