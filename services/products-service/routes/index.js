import { Router } from "express";

import ProductController from "../controllers/ProductController.js";
import CategoryController from "../controllers/CategoryController.js";

import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  getProductsSchema,
  updateProductIdSchema,
  updateProductSchema,
} from "../validations/products.js";
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoriesSchema,
  getCategorySchema,
  updateCategoryIdSchema,
  updateCategorySchema,
} from "../validations/categories.js";

import controllersHandler from "../handlers/controllersHandler.js";

import authorizationMiddleware from "../middlewares/authorizationMiddleware.js";
import validationsMiddleware from "../middlewares/validationsMiddleware.js";

import NotFoundError from "../../products-service/exceptions/NotFoundError.js";

const router = Router();

// GET all products
router.get(
  "/api/v1/products",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getProductsSchema, "query"),
  controllersHandler(ProductController.getAllProducts)
);

// GET a product by ID
router.get(
  "/api/v1/products/:id",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getProductSchema, "params"),
  controllersHandler(ProductController.getProductById)
);

// POST a new product
router.post(
  "/api/v1/products",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createProductSchema, "body"),
  controllersHandler(ProductController.createProduct)
);

// PUT update a product by ID
router.put(
  "/api/v1/products",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateProductIdSchema, "params"),
  validationsMiddleware(updateProductSchema, "body"),
  controllersHandler(ProductController.updateProductById)
);

// DELETE a product by ID
router.delete(
  "/api/v1/products/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteProductSchema, "params"),
  controllersHandler(ProductController.deleteProductById)
);

// GET all categories
router.get(
  "/api/v1/categories",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getCategoriesSchema, "query"),
  controllersHandler(CategoryController.getAllCategories)
);

// GET a category by ID
router.get(
  "/api/v1/categories/:id",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getCategorySchema, "params"),
  controllersHandler(CategoryController.getCategoryById)
);

// POST a new category
router.post(
  "/api/v1/categories",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createCategorySchema, "body"),
  controllersHandler(CategoryController.createCategory)
);

// PUT update a category by ID
router.put(
  "/api/v1/categories",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateCategoryIdSchema, "params"),
  validationsMiddleware(updateCategorySchema, "body"),
  controllersHandler(CategoryController.updateCategoryById)
);

// DELETE a category by ID
router.delete(
  "/api/v1/categories/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteCategorySchema, "params"),
  controllersHandler(CategoryController.deleteCategoryById)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
