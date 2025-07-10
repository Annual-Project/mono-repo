import { Router } from "express";

import StockController from "../controllers/StockController.js";
import StockHistoryController from "../controllers/StockHistoryController.js";
import StoreController from "../controllers/StoreController.js";

import controllersHandler from "../handlers/controllersHandler.js";

import validationsMiddleware from "../middlewares/validationsMiddleware.js";
import authorizationMiddleware from "../middlewares/authorizationMiddleware.js";

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

const router = Router();

router.get(
  "/api/v1/stores",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getStoresSchema, "query"),
  controllersHandler(StoreController.getAllStores)
);
router.get(
  "/api/v1/stores/:id",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getStoreSchema, "params"),
  controllersHandler(StoreController.getStoreById)
);
router.get(
  "/api/v1/stocks",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getStocksSchema, "query"),
  controllersHandler(StockController.getAllStocks)
);
router.get(
  "/api/v1/stocks/store/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getStockSchema, "params"),
  validationsMiddleware(getStocksSchema, "query"),
  controllersHandler(StockController.getStockByStoreId)
);
router.get(
  "/api/v1/stocks/history",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getStocksHistorySchema, "query"),
  controllersHandler(StockHistoryController.getAllHistory)
);
router.get(
  "/api/v1/stocks/:id",
  authorizationMiddleware([], ["user"]),
  validationsMiddleware(getStockSchema, "params"),
  controllersHandler(StockController.getStockById)
);
router.get(
  "/api/v1/stocks/history/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getHistorySchema, "params"),
  controllersHandler(StockHistoryController.getHistoryById)
);
router.get(
  "/api/v1/stocks/:productId/history",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getProductHistorySchema, "params"),
  controllersHandler(StockHistoryController.getHistoryByProductId)
);

router.post(
  "/api/v1/stores",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createStoreSchema, "body"),
  controllersHandler(StoreController.createStore)
);
router.post(
  "/api/v1/stocks",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createStockSchema, "body"),
  controllersHandler(StockController.createStock)
);
router.post(
  "/api/v1/stocks/history",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createHistorySchema, "body"),
  controllersHandler(StockHistoryController.createHistory)
);

router.put(
  "/api/v1/stores",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateStoreIdSchema, "params"),
  validationsMiddleware(updateStoreSchema, "body"),
  controllersHandler(StoreController.updateStoreById)
);
router.put(
  "/api/v1/stocks",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateStockIdSchema, "params"),
  validationsMiddleware(updateStockSchema, "body"),
  controllersHandler(StockController.updateStockById)
);
router.put(
  "/api/v1/stocks/history",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateHistoryIdSchema, "params"),
  validationsMiddleware(updateHistorySchema, "body"),
  controllersHandler(StockHistoryController.updateHistoryById)
);

router.delete(
  "/api/v1/stores/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteStoreSchema, "params"),
  controllersHandler(StoreController.deleteStoreById)
);
router.delete(
  "/api/v1/stocks/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteStockSchema, "params"),
  controllersHandler(StockController.deleteStockById)
);
router.delete(
  "/api/v1/stocks/history/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteHistorySchema, "params"),
  controllersHandler(StockHistoryController.deleteHistoryById)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
