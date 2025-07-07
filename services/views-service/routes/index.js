import { Router } from "express";

import NotFoundError from "../exceptions/NotFoundError.js";

const router = Router();

router.get("/", (_, res) => {
  res.render("client/landing", { title: "Welcome to SkillForge" });
});

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
