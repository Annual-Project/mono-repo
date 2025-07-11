import { Router } from "express";

import AggregatedStoreController from "../controllers/AggregatedStoreController.js";
import AggregatedUserController from "../controllers/AggregatedUserController.js";

import controllersHandler from "../handlers/controllersHandler.js";

import authorizationMiddleware from "../middlewares/authorizationMiddleware.js";

import RolesStore from "../../../shared/stores/RolesStore.js";

import NotFoundError from "../exceptions/NotFoundError.js";
import AggregatedProductController from "../controllers/AggregatedProductController.js";
import AggregatedCategoryController from "../controllers/AggregatedCategoryController.js";
import AggregatedStockController from "../controllers/AggregatedStockController.js";
import AggregatedTransferController from "../controllers/AggregatedTransferController.js";

const router = Router();

/**
 * Routes to render client views
 */
router.get("/", async (req, res) => {
  const user = req.auth;
  const { userId = null } = user || {};

  let hasAdmin = false;
  if (Number.parseInt(userId)) {
    try {
      const userRoles = await RolesStore.getRoles(userId);
      console.log("User Roles:", userRoles);
      hasAdmin = userRoles.includes('admin');
    } catch (error) {
      console.error("Error fetching user roles:", error);
      hasAdmin = false;
    }
  }

  res.render("client/landing", {
    user: user ? {
      ...user,
      admin: hasAdmin,
    } : null,
  });
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
router.get("/admin", async (req, res) => {
  const user = req.auth;
  const { userId = null } = user || {};

  if (!userId) {
    return res.render('communes/404');
  }

  let hasAdmin = false;
  if (Number.parseInt(userId)) {
    try {
      const userRoles = await RolesStore.getRoles(userId);
      console.log("User Roles:", userRoles);
      hasAdmin = userRoles.includes('admin');
    } catch (error) {
      console.error("Error fetching user roles:", error);
      hasAdmin = false;
    }
  }

  res.render("admin/dashboard", {
    user: user ? {
      ...user,
      admin: hasAdmin,
    } : null,
  });
});

router.get(
  "/admin/stocks",
  // authorizationMiddleware([], ["admin"]),
  controllersHandler(AggregatedStockController.getAggregatedStocksForAdmin),
);

router.get(
  "/admin/products",
  // authorizationMiddleware([], ["admin"]),
  controllersHandler(AggregatedProductController.getAggregatedProductsForAdmin),
);

router.get(
  "/admin/categories",
  // authorizationMiddleware([], ["admin"]),
  controllersHandler(AggregatedCategoryController.getAggregatedCategoriesAdmin),
);

router.get(
  "/admin/stores",
  // authorizationMiddleware([], ["admin"]),
  controllersHandler(AggregatedStoreController.getAggregatedStoresAdmin),
);

router.get(
  "/admin/transfers",
  // authorizationMiddleware([], ["admin"]),
  controllersHandler(AggregatedTransferController.getAggregatedTransfersAdmin),
);

router.get(
  "/admin/users",
  // authorizationMiddleware([], ["admin"]),
  controllersHandler(AggregatedUserController.getAggregatedUsers),
);

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

router.get("/logout", (req, res) => {

  // reset les cookies
  res.clearCookie("accessTokenM");
  res.clearCookie("refreshTokenM");

  res.redirect("/signin");
});

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
