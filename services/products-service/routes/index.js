import { Router } from "express";
import productsController from "../controllers/products.js";
import categoriesController from "../controllers/categories.js";
import validateData from "../middlewares/validations.js";
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

import controllerHandler from "../handlers/controllers.js";

import authorization from "../middlewares/authorization.js";

import NotFoundError from "../../products-service/exceptions/NotFoundError.js";

const router = Router();

// GET all products
router.get(
  "/api/v1/products",
  authorization([], ["user"]),
  validateData(getProductsSchema, "query"),
  controllerHandler(productsController.getAllProducts)
);

// GET a product by ID
router.get(
  "/api/v1/products/:id",
  authorization([], ["user"]),
  validateData(getProductSchema, "params"),
  controllerHandler(productsController.getProductById)
);

// POST a new product
router.post(
  "/api/v1/products",
  authorization([], ["admin"]),
  validateData(createProductSchema, "body"),
  controllerHandler(productsController.createProduct)
);

// PUT update a product by ID
router.put(
  "/api/v1/products",
  authorization([], ["admin"]),
  validateData(updateProductIdSchema, "params"),
  validateData(updateProductSchema, "body"),
  controllerHandler(productsController.updateProductById)
);

// DELETE a product by ID
router.delete(
  "/api/v1/products/:id",
  authorization([], ["superadmin"]),
  validateData(deleteProductSchema, "params"),
  controllerHandler(productsController.deleteProductById)
);

// GET all categories
router.get(
  "/api/v1/categories",
  authorization([], ["user"]),
  validateData(getCategoriesSchema, "query"),
  controllerHandler(categoriesController.getAllCategories)
);

// GET a category by ID
router.get(
  "/api/v1/categories/:id",
  authorization([], ["user"]),
  validateData(getCategorySchema, "params"),
  controllerHandler(categoriesController.getCategoryById)
);

// POST a new category
router.post(
  "/api/v1/categories",
  authorization([], ["admin"]),
  validateData(createCategorySchema, "body"),
  controllerHandler(categoriesController.createCategory)
);

// PUT update a category by ID
router.put(
  "/api/v1/categories",
  authorization([], ["admin"]),
  validateData(updateCategoryIdSchema, "params"),
  validateData(updateCategorySchema, "body"),
  controllerHandler(categoriesController.updateCategoryById)
);

// DELETE a category by ID
router.delete(
  "/api/v1/categories/:id",
  authorization([], ["superadmin"]),
  validateData(deleteCategorySchema, "params"),
  controllerHandler(categoriesController.deleteCategoryById)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
