import { Router } from "express";

// PRODUCTS / CATEGORIES
import productsController from "../controllers/products.js";
import categoriesController from "../controllers/categories.js";
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

// TRANSFERS
import transfersController from "../controllers/transfers.js";
import {
  createTransferSchema,
  deleteTransferSchema,
  getTransferSchema,
  getTransfersSchema,
  updateTransferIdSchema,
  updateTransferSchema,
} from "../validations/transfers.js";

// STOCKS / STORES
import stockController from "../controllers/stock.controller.js";
import historyController from "../controllers/stockHistory.controller.js";
import storeController from "../controllers/store.controller.js";
import {
  getStockSchema,
  createStockSchema,
  updateStockSchema,
  deleteStockSchema,
  updateStockIdSchema,
  getStocksSchema,
} from "../validations/stock.js";
import {
  getHistorySchema,
  createHistorySchema,
  updateHistorySchema,
  deleteHistorySchema,
  getProductHistorySchema,
  updateHistoryIdSchema,
  getStocksHistorySchema,
} from "../validations/stockHistory.js";
import {
  createStoreSchema,
  deleteStoreSchema,
  getStoreSchema,
  getStoresSchema,
  updateStoreIdSchema,
  updateStoreSchema,
} from "../validations/store.js";

// OTHER
import validateData from "../middlewares/validations.js";

import controllerHandler from "../handlers/controllers.js";

import NotFoundError from "../exceptions/NotFoundError.js";

const router = Router();

// GET all products
router.get(
  "/api/central/products",
  validateData(getProductsSchema, "query"),
  controllerHandler(productsController.getAllProducts)
);

// GET a product by ID
router.get(
  "/api/central/products/:id",
  validateData(getProductSchema, "params"),
  controllerHandler(productsController.getProductById)
);

// POST a new product
router.post(
  "/api/central/products",
  validateData(createProductSchema, "body"),
  controllerHandler(productsController.createProduct)
);

// PUT update a product by ID
router.put(
  "/api/central/products/:id",
  validateData(updateProductIdSchema, "params"),
  validateData(updateProductSchema, "body"),
  controllerHandler(productsController.updateProductById)
);

// DELETE a product by ID
router.delete(
  "/api/central/products/:id",
  validateData(deleteProductSchema, "params"),
  controllerHandler(productsController.deleteProductById)
);

// GET all categories
router.get(
  "/api/central/categories",
  validateData(getCategoriesSchema, "query"),
  controllerHandler(categoriesController.getAllCategories)
);

// GET a category by ID
router.get(
  "/api/central/categories/:id",
  validateData(getCategorySchema, "params"),
  controllerHandler(categoriesController.getCategoryById)
);

// POST a new category
router.post(
  "/api/central/categories",
  validateData(createCategorySchema, "body"),
  controllerHandler(categoriesController.createCategory)
);

// PUT update a category by ID
router.put(
  "/api/central/categories/:id",
  validateData(updateCategoryIdSchema, "params"),
  validateData(updateCategorySchema, "body"),
  controllerHandler(categoriesController.updateCategoryById)
);

// DELETE a category by ID
router.delete(
  "/api/central/categories/:id",
  validateData(deleteCategorySchema, "params"),
  controllerHandler(categoriesController.deleteCategoryById)
);

router.get(
  "/api/central/stores",
  validateData(getStoresSchema, "query"),
  controllerHandler(storeController.getAllStores)
);
router.get(
  "/api/central/stores/:id",
  validateData(getStoreSchema, "params"),
  controllerHandler(storeController.getStoreById)
);
router.get(
  "/api/central/stocks",
  validateData(getStocksSchema, "query"),
  controllerHandler(stockController.getAllStocks)
);
router.get(
  "/api/central/stocks/history",
  validateData(getStocksHistorySchema, "query"),
  controllerHandler(historyController.getAllHistory)
);
router.get(
  "/api/central/stocks/:id",
  validateData(getStockSchema, "params"),
  controllerHandler(stockController.getStockById)
);
router.get(
  "/api/central/stocks/history/:id",
  validateData(getHistorySchema, "params"),
  controllerHandler(historyController.getHistoryById)
);
router.get(
  "/api/central/stocks/:productId/history",
  validateData(getProductHistorySchema, "params"),
  controllerHandler(historyController.getHistoryByProductId)
);

router.post(
  "/api/central/stores",
  validateData(createStoreSchema, "body"),
  controllerHandler(storeController.createStore)
);
router.post(
  "/api/central/stocks",
  validateData(createStockSchema, "body"),
  controllerHandler(stockController.createStock)
);
router.post(
  "/api/central/stocks/history",
  validateData(createHistorySchema, "body"),
  controllerHandler(historyController.createHistory)
);

router.put(
  "/api/central/stores/:id",
  validateData(updateStoreIdSchema, "params"),
  validateData(updateStoreSchema, "body"),
  controllerHandler(storeController.updateStoreById)
);
router.put(
  "/api/central/stocks/:id",
  validateData(updateStockIdSchema, "params"),
  validateData(updateStockSchema, "body"),
  controllerHandler(stockController.updateStockById)
);
router.put(
  "/api/central/stocks/history/:id",
  validateData(updateHistoryIdSchema, "params"),
  validateData(updateHistorySchema, "body"),
  controllerHandler(historyController.updateHistoryById)
);

router.delete(
  "/api/central/stores/:id",
  validateData(deleteStoreSchema, "params"),
  controllerHandler(storeController.deleteStoreById)
);
router.delete(
  "/api/central/stocks/:id",
  validateData(deleteStockSchema, "params"),
  controllerHandler(stockController.deleteStockById)
);
router.delete(
  "/api/central/stocks/history/:id",
  validateData(deleteHistorySchema, "params"),
  controllerHandler(historyController.deleteHistoryById)
);

// GET all transfers
router.get(
  "/api/central/transfers",
  validateData(getTransfersSchema, "query"),
  controllerHandler(transfersController.getAllTransfers)
);

// GET a transfer by ID
router.get(
  "/api/central/transfers/:id",
  validateData(getTransferSchema, "params"),
  controllerHandler(transfersController.getTransferById)
);

// POST a new transfer
router.post(
  "/api/central/transfers",
  validateData(createTransferSchema, "body"),
  controllerHandler(transfersController.createTransfer)
);

// PUT update a transfer by ID
router.put(
  "/api/central/transfers/:id",
  validateData(updateTransferIdSchema, "params"),
  validateData(updateTransferSchema, "body"),
  controllerHandler(transfersController.updateTransferById)
);

// DELETE a transfer by ID
router.delete(
  "/api/central/transfers/:id",
  validateData(deleteTransferSchema, "params"),
  controllerHandler(transfersController.deleteTransferById)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
