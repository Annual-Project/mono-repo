import { Router } from "express";

// PRODUCTS / CATEGORIES
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

// TRANSFERS
import TransferController from "../controllers/TransferController.js";
import {
  createTransferSchema,
  deleteTransferSchema,
  getTransferSchema,
  getTransfersSchema,
  updateTransferIdSchema,
  updateTransferSchema,
} from "../validations/transfers.js";

// STOCKS / STORES
import StockController from "../controllers/StockController.js";
import StockHistoryController from "../controllers/StockHistoryController.js";
import StoreController from "../controllers/StoreController.js";
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
import validationsMiddleware from "../middlewares/validationsMiddleware.js";

import controllersHandler from "../handlers/controllersHandler.js";

import NotFoundError from "../exceptions/NotFoundError.js";

const router = Router();

// GET all products
router.get(
  "/api/v1/central/products",
  validationsMiddleware(getProductsSchema, "query"),
  controllersHandler(ProductController.getAllProducts)
);

// GET a product by ID
router.get(
  "/api/v1/central/products/:id",
  validationsMiddleware(getProductSchema, "params"),
  controllersHandler(ProductController.getProductById)
);

// POST a new product
router.post(
  "/api/v1/central/products",
  validationsMiddleware(createProductSchema, "body"),
  controllersHandler(ProductController.createProduct)
);

// PUT update a product by ID
router.put(
  "/api/v1/central/products/:id",
  validationsMiddleware(updateProductIdSchema, "params"),
  validationsMiddleware(updateProductSchema, "body"),
  controllersHandler(ProductController.updateProductById)
);

// DELETE a product by ID
router.delete(
  "/api/v1/central/products/:id",
  validationsMiddleware(deleteProductSchema, "params"),
  controllersHandler(ProductController.deleteProductById)
);

// GET all categories
router.get(
  "/api/v1/central/categories",
  validationsMiddleware(getCategoriesSchema, "query"),
  controllersHandler(CategoryController.getAllCategories)
);

// GET a category by ID
router.get(
  "/api/v1/central/categories/:id",
  validationsMiddleware(getCategorySchema, "params"),
  controllersHandler(CategoryController.getCategoryById)
);

// POST a new category
router.post(
  "/api/v1/central/categories",
  validationsMiddleware(createCategorySchema, "body"),
  controllersHandler(CategoryController.createCategory)
);

// PUT update a category by ID
router.put(
  "/api/v1/central/categories/:id",
  validationsMiddleware(updateCategoryIdSchema, "params"),
  validationsMiddleware(updateCategorySchema, "body"),
  controllersHandler(CategoryController.updateCategoryById)
);

// DELETE a category by ID
router.delete(
  "/api/v1/central/categories/:id",
  validationsMiddleware(deleteCategorySchema, "params"),
  controllersHandler(CategoryController.deleteCategoryById)
);

router.get(
  "/api/v1/central/stores",
  validationsMiddleware(getStoresSchema, "query"),
  controllersHandler(StoreController.getAllStores)
);
router.get(
  "/api/v1/central/stores/:id",
  validationsMiddleware(getStoreSchema, "params"),
  controllersHandler(StoreController.getStoreById)
);
router.get(
  "/api/v1/central/stocks",
  validationsMiddleware(getStocksSchema, "query"),
  controllersHandler(StockController.getAllStocks)
);
router.get(
  "/api/v1/central/stocks/history",
  validationsMiddleware(getStocksHistorySchema, "query"),
  controllersHandler(StockHistoryController.getAllHistory)
);
router.get(
  "/api/v1/central/stocks/:id",
  validationsMiddleware(getStockSchema, "params"),
  controllersHandler(StockController.getStockById)
);
router.get(
  "/api/v1/central/stocks/history/:id",
  validationsMiddleware(getHistorySchema, "params"),
  controllersHandler(StockHistoryController.getHistoryById)
);
router.get(
  "/api/v1/central/stocks/:productId/history",
  validationsMiddleware(getProductHistorySchema, "params"),
  controllersHandler(StockHistoryController.getHistoryByProductId)
);

router.post(
  "/api/v1/central/stores",
  validationsMiddleware(createStoreSchema, "body"),
  controllersHandler(StoreController.createStore)
);
router.post(
  "/api/v1/central/stocks",
  validationsMiddleware(createStockSchema, "body"),
  controllersHandler(StockController.createStock)
);
router.post(
  "/api/v1/central/stocks/history",
  validationsMiddleware(createHistorySchema, "body"),
  controllersHandler(StockHistoryController.createHistory)
);

router.put(
  "/api/v1/central/stores/:id",
  validationsMiddleware(updateStoreIdSchema, "params"),
  validationsMiddleware(updateStoreSchema, "body"),
  controllersHandler(StoreController.updateStoreById)
);
router.put(
  "/api/v1/central/stocks/:id",
  validationsMiddleware(updateStockIdSchema, "params"),
  validationsMiddleware(updateStockSchema, "body"),
  controllersHandler(StockController.updateStockById)
);
router.put(
  "/api/v1/central/stocks/history/:id",
  validationsMiddleware(updateHistoryIdSchema, "params"),
  validationsMiddleware(updateHistorySchema, "body"),
  controllersHandler(StockHistoryController.updateHistoryById)
);

router.delete(
  "/api/v1/central/stores/:id",
  validationsMiddleware(deleteStoreSchema, "params"),
  controllersHandler(StoreController.deleteStoreById)
);
router.delete(
  "/api/v1/central/stocks/:id",
  validationsMiddleware(deleteStockSchema, "params"),
  controllersHandler(StockController.deleteStockById)
);
router.delete(
  "/api/v1/central/stocks/history/:id",
  validationsMiddleware(deleteHistorySchema, "params"),
  controllersHandler(StockHistoryController.deleteHistoryById)
);

// GET all transfers
router.get(
  "/api/v1/central/transfers",
  validationsMiddleware(getTransfersSchema, "query"),
  controllersHandler(TransferController.getAllTransfers)
);

// GET a transfer by ID
router.get(
  "/api/v1/central/transfers/:id",
  validationsMiddleware(getTransferSchema, "params"),
  controllersHandler(TransferController.getTransferById)
);

// POST a new transfer
router.post(
  "/api/v1/central/transfers",
  validationsMiddleware(createTransferSchema, "body"),
  controllersHandler(TransferController.createTransfer)
);

// PUT update a transfer by ID
router.put(
  "/api/v1/central/transfers/:id",
  validationsMiddleware(updateTransferIdSchema, "params"),
  validationsMiddleware(updateTransferSchema, "body"),
  controllersHandler(TransferController.updateTransferById)
);

// DELETE a transfer by ID
router.delete(
  "/api/v1/central/transfers/:id",
  validationsMiddleware(deleteTransferSchema, "params"),
  controllersHandler(TransferController.deleteTransferById)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
