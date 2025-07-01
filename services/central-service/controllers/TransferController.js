import prisma from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

class TransferController {

  static async getAllTransfers(req, res) {
    const { limit, offset } = req.query;

    const transfers = await prisma.transfer.findMany({
      take: limit,
      skip: offset,
    });

    res.status(200).json(transfers);
  }

  static async getTransferById(req, res) {
    const { id } = req.params;

    const transfer = await prisma.transfer.findUnique({
      where: { id }
    });

    if (!transfer) {
      throw new NotFoundError('Transfer not found');
    }

    res.status(200).json(transfer);
  }

  static async createTransfer(req, res) {
    const { productId, sourceStoreId, destinationStoreId, quantity, status, comment } = req.body;

    const newTransfer = await prisma.transfer.create({
      data: {
        productId,
        sourceStoreId,
        destinationStoreId,
        quantity,
        status,
        comment,
      }
    });

    if (!newTransfer) {
      throw new BadRequestError('Failed to create transfer');
    }

    res.status(201).json({
      message: 'Transfer created successfully',
      data: newTransfer,
    });
  }

  static async updateTransferById(req, res) {
    const { id, productId, sourceStoreId, destinationStoreId, quantity, status, comment } = req.body;

    const updatedTransfer = await prisma.transfer.update({
      where: { id },
      data: {
        productId,
        sourceStoreId,
        destinationStoreId,
        quantity,
        status,
        comment,
      }
    });

    if (!updatedTransfer) {
      throw new NotFoundError('Transfer not found');
    }

    res.status(200).json({
      message: 'Transfer updated successfully',
      data: updatedTransfer,
    });
  }

  static async deleteTransferById(req, res) {
    const { id } = req.params;

    const transferExists = await prisma.transfer.findUnique({
      where: { id },
    });

    if (!transferExists) {
      throw new NotFoundError('Transfer not found');
    }

    const deletedTransfer = await prisma.transfer.delete({
      where: { id }
    });

    if (!deletedTransfer) {
      throw new NotFoundError('Transfer not found');
    }

    res.status(200).json({ message: 'Transfer deleted successfully', data: deletedTransfer });
  }

};

export default TransferController;
