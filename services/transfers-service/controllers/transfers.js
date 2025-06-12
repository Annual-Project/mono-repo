import prisma from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

const transfersController = {

  async getAllTransfers(_, res) {
    const transfers = await prisma.transfer.findMany();
    res.status(200).json(transfers);
  },

  async getTransferById(req, res) {
    const { id } = req.params;

    const transfer = await prisma.transfer.findUnique({
      where: { id }
    });

    if (!transfer) {
      throw new NotFoundError('Transfer not found');
    }

    res.status(200).json(transfer);
  },

  async createTransfer(req, res) {
    const { productId, sourceStoreId, destinationStoreId, quantity, status, comment } = req.body;

    const newTransfer = await prisma.transfer.create({
      data: {
        productId,
        sourceStoreId,
        destinationStoreId,
        quantity,
        status,
        comment,
        updatedAt: new Date(),  
      }
    });

    if (!newTransfer) {
      throw new BadRequestError('Failed to create transfer');
    }

    res.status(201).json({
      message: 'Transfer created successfully',
      data: newTransfer,
    });
  },

  async updateTransferById(req, res) {
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
  },

  async deleteTransferById(req, res) {
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

export default transfersController;
