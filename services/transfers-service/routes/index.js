import { Router } from "express";

import TransferController from "../controllers/TransferController.js";

import controllersHandler from "../handlers/controllersHandler.js";

import validationsMiddleware from "../middlewares/validationsMiddleware.js";
import authorizationMiddleware from "../middlewares/authorizationMiddleware.js";

import {
  createTransferSchema,
  deleteTransferSchema,
  getTransferSchema,
  getTransfersSchema,
  updateTransferIdSchema,
  updateTransferSchema,
} from "../validations/transfers.js";

const router = Router();

// GET all transfers
router.get(
  "/api/v1/transfers",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getTransfersSchema, "query"),
  controllersHandler(TransferController.getAllTransfers)
);

// GET a transfer by ID
router.get(
  "/api/v1/transfers/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getTransferSchema, "params"),
  controllersHandler(TransferController.getTransferById)
);

// POST a new transfer
router.post(
  "/api/v1/transfers",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createTransferSchema, "body"),
  controllersHandler(TransferController.createTransfer)
);

// PUT update a transfer by ID
router.put(
  "/api/v1/transfers/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateTransferIdSchema, "params"),
  validationsMiddleware(updateTransferSchema, "body"),
  controllersHandler(TransferController.updateTransferById)
);

// DELETE a transfer by ID
router.delete(
  "/api/v1/transfers/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(deleteTransferSchema, "params"),
  controllersHandler(TransferController.deleteTransferById)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
