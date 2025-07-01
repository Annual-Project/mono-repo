import { Router } from "express";

import stockController from "../controllers/stock.controller.js";
import historyController from "../controllers/stockHistory.controller.js";

import controllerHandler from "../handlers/controllers.js";
import validateData from "../middlewares/validations.js";
import authorization from "../middlewares/authorization.js";

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
import storeController from "../controllers/store.controller.js";
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
  authorization([], ["user"]),
  validateData(getStoresSchema, "query"),
  controllerHandler(storeController.getAllStores)
);
router.get(
  "/api/v1/stores/:id",
  authorization([], ["user"]),
  validateData(getStoreSchema, "params"),
  controllerHandler(storeController.getStoreById)
);
router.get(
  "/api/v1/stocks",
  authorization([], ["user"]),
  validateData(getStocksSchema, "query"),
  controllerHandler(stockController.getAllStocks)
);
router.get(
  "/api/v1/stocks/history",
  authorization([], ["admin"]),
  validateData(getStocksHistorySchema, "query"),
  controllerHandler(historyController.getAllHistory)
);
router.get(
  "/api/v1/stocks/:id",
  authorization([], ["user"]),
  validateData(getStockSchema, "params"),
  controllerHandler(stockController.getStockById)
);
router.get(
  "/api/v1/stocks/history/:id",
  authorization([], ["admin"]),
  validateData(getHistorySchema, "params"),
  controllerHandler(historyController.getHistoryById)
);
router.get(
  "/api/v1/stocks/:productId/history",
  authorization([], ["admin"]),
  validateData(getProductHistorySchema, "params"),
  controllerHandler(historyController.getHistoryByProductId)
);

router.post(
  "/api/v1/stores",
  authorization([], ["admin"]),
  validateData(createStoreSchema, "body"),
  controllerHandler(storeController.createStore)
);
router.post(
  "/api/v1/stocks",
  authorization([], ["admin"]),
  validateData(createStockSchema, "body"),
  controllerHandler(stockController.createStock)
);
router.post(
  "/api/v1/stocks/history",
  authorization([], ["admin"]),
  validateData(createHistorySchema, "body"),
  controllerHandler(historyController.createHistory)
);

router.put(
  "/api/v1/stores",
  authorization([], ["admin"]),
  validateData(updateStoreIdSchema, "params"),
  validateData(updateStoreSchema, "body"),
  controllerHandler(storeController.updateStoreById)
);
router.put(
  "/api/v1/stocks",
  authorization([], ["admin"]),
  validateData(updateStockIdSchema, "params"),
  validateData(updateStockSchema, "body"),
  controllerHandler(stockController.updateStockById)
);
router.put(
  "/api/v1/stocks/history",
  authorization([], ["admin"]),
  validateData(updateHistoryIdSchema, "params"),
  validateData(updateHistorySchema, "body"),
  controllerHandler(historyController.updateHistoryById)
);

router.delete(
  "/api/v1/stores/:id",
  authorization([], ["superadmin"]),
  validateData(deleteStoreSchema, "params"),
  controllerHandler(storeController.deleteStoreById)
);
router.delete(
  "/api/v1/stocks/:id",
  authorization([], ["superadmin"]),
  validateData(deleteStockSchema, "params"),
  controllerHandler(stockController.deleteStockById)
);
router.delete(
  "/api/v1/stocks/history/:id",
  authorization([], ["superadmin"]),
  validateData(deleteHistorySchema, "params"),
  controllerHandler(historyController.deleteHistoryById)
);

export default router;
