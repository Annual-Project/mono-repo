import express from 'express';
import stockController from '../controllers/stock.controller.js';
import historyController from '../controllers/stockHistory.controller.js';
import errorHandler from '../middlewares/error.js';
import validateData from '../middlewares/validations.js';
import {getStockSchema,createStockSchema,updateStockSchema,deleteStockSchema} from '../validations/stock.js';
import {getHistorySchema,createHistorySchema,updateHistorySchema,deleteHistorySchema,getProductHistorySchema} from '../validations/stockHistory.js';
import storeController from '../controllers/store.controller.js';
import { createStoreSchema, deleteStoreSchema, getStoreSchema, updateStoreSchema } from '../validations/store.js';

const router = express.Router();

router.get('/api/v1/stores', errorHandler(storeController.getAllStores));
router.get('/api/v1/stores/:id', validateData(getStoreSchema, 'params'), errorHandler(storeController.getStoreById));
router.get('/api/v1/stocks', errorHandler(stockController.getAllStocks));
router.get('/api/v1/stocks/history', errorHandler(historyController.getAllHistory));
router.get('/api/v1/stocks/:id',validateData(getStockSchema, 'params'),errorHandler(stockController.getStockById));
router.get('/api/v1/stocks/history/:id',validateData(getHistorySchema, 'params'),errorHandler(historyController.getHistoryById));
router.get('/api/v1/stocks/:productId/history',validateData(getProductHistorySchema, 'params'),errorHandler(historyController.getHistoryByProductId));

router.post('/api/v1/stores', validateData(createStoreSchema, 'body'), errorHandler(storeController.createStore));
router.post('/api/v1/stocks',validateData(createStockSchema, 'body'),errorHandler(stockController.createStock));
router.post('/api/v1/stocks/history',validateData(createHistorySchema, 'body'),errorHandler(historyController.createHistory));

router.put('/api/v1/stores', validateData(updateStoreSchema, 'body'), errorHandler(storeController.updateStoreById));
router.put('/api/v1/stocks',validateData(updateStockSchema, 'body'),errorHandler(stockController.updateStockById));
router.put('/api/v1/stocks/history',validateData(updateHistorySchema, 'body'),errorHandler(historyController.updateHistoryById));

router.delete('/api/v1/stores/:id', validateData(deleteStoreSchema, 'params'), errorHandler(storeController.deleteStoreById));
router.delete('/api/v1/stocks/:id',validateData(deleteStockSchema, 'params'),errorHandler(stockController.deleteStockById));
router.delete('/api/v1/stocks/history/:id',validateData(deleteHistorySchema, 'params'),errorHandler(historyController.deleteHistoryById));


export default router;
