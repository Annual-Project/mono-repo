import { Router } from "express";

import AggregatedStoreController from "../controllers/AggregatedStoreController.js";
import AggregatedUserController from "../controllers/AggregatedUserController.js";

import controllersHandler from "../handlers/controllersHandler.js";

import authorizationMiddleware from "../middlewares/authorizationMiddleware.js";

import NotFoundError from "../exceptions/NotFoundError.js";
import AggregatedProductController from "../controllers/AggregatedProductController.js";

const router = Router();

/**
 * Routes to render client views
 */
router.get("/", (_, res) => {
  res.render("client/landing");
});

router.get(
  "/stores",
  controllersHandler(AggregatedStoreController.getAggregatedStores),
);

router.get(
  "/stores/:storeId/products",
  controllersHandler(AggregatedProductController.getAggregatedProductsByStore),
);

/**
 * Routes to render admin views
 */
router.get("/admin", (_, res) => {
  res.render("admin/dashboard", { title: "Welcome to SkillForge" });
});

router.get("/admin/stocks", (_, res) => {
  res.render("admin/stocks", { title: "Welcome to SkillForge" });
});

router.get("/admin/products", (_, res) => {
  res.render("admin/products", { title: "Welcome to SkillForge" });
});

router.get("/admin/categories", (_, res) => {
  res.render("admin/categories", { title: "Welcome to SkillForge" });
});

router.get("/admin/stores", (_, res) => {
  res.render("admin/stores", { title: "Welcome to SkillForge" });
});

router.get("/admin/transfers", (_, res) => {
  res.render("admin/transfers", { title: "Welcome to SkillForge" });
});

router.get("/admin/users", (_, res) => {
  res.render("admin/users", { title: "Welcome to SkillForge" });
});

/**
 * Routes to render utilitaires views
 */
router.get(
  "/profile",
  controllersHandler(AggregatedUserController.getAggregatedUserProfile),
);

router.get("/change-password", (_, res) => {
  res.render("utilitaires/change-password", { title: "Welcome to SkillForge" });
});

router.get("/signin", (_, res) => {
  res.render("utilitaires/signin", { title: "Welcome to SkillForge" });
});

router.get("/signup", (_, res) => {
  res.render("utilitaires/signup", { title: "Welcome to SkillForge" });
});

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
