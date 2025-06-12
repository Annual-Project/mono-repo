import { Router } from 'express';
import transfersController from '../controllers/transfers.js';
import validateData from '../middlewares/validations.js';
import { createTransferSchema, deleteTransferSchema, getTransferSchema, updateTransferSchema } from '../validations/transfers.js';
import errorHandler from '../middlewares/errors.js';

const router = Router();

// GET all transfers
router.get('/api/v1/transfers', errorHandler(transfersController.getAllTransfers));

// GET a transfer by ID
router.get('/api/v1/transfers/:id', validateData(getTransferSchema, 'params'), errorHandler(transfersController.getTransferById));

// POST a new transfer
router.post('/api/v1/transfers', validateData(createTransferSchema, 'body'), errorHandler(transfersController.createTransfer));

// PUT update a transfer by ID
router.put('/api/v1/transfers', validateData(updateTransferSchema, 'body'), errorHandler(transfersController.updateTransferById));

// DELETE a transfer by ID
router.delete('/api/v1/transfers/:id', validateData(deleteTransferSchema, 'params'), errorHandler(transfersController.deleteTransferById));

export default router;
