import { Router } from "express";

import transfersController from "../controllers/transfers.js";

import validateData from "../middlewares/validations.js";
import authorization from "../middlewares/authorization.js";
import controllerHandler from "../handlers/controllers.js";

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
  authorization([], ["admin"]),
  validateData(getTransfersSchema, "query"),
  controllerHandler(transfersController.getAllTransfers)
);

// GET a transfer by ID
router.get(
  "/api/v1/transfers/:id",
  authorization([], ["admin"]),
  validateData(getTransferSchema, "params"),
  controllerHandler(transfersController.getTransferById)
);

// POST a new transfer
router.post(
  "/api/v1/transfers",
  authorization([], ["admin"]),
  validateData(createTransferSchema, "body"),
  controllerHandler(transfersController.createTransfer)
);

// PUT update a transfer by ID
router.put(
  "/api/v1/transfers",
  authorization([], ["admin"]),
  validateData(updateTransferIdSchema, "params"),
  validateData(updateTransferSchema, "body"),
  controllerHandler(transfersController.updateTransferById)
);

// DELETE a transfer by ID
router.delete(
  "/api/v1/transfers/:id",
  authorization([], ["superadmin"]),
  validateData(deleteTransferSchema, "params"),
  controllerHandler(transfersController.deleteTransferById)
);

export default router;
