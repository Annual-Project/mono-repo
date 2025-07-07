import prisma from '../config/db.js';

import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

class TransferService {
  static async getAllTransfers(limit, offset) {
    return await prisma.transfer.findMany({
      take: limit,
      skip: offset,
    });
  }

  static async getTransferById(id) {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundError('Transfer not found');
    }

    return transfer;
  }

  static async createTransfer(data) {
    const { id, productId, sourceStoreId, destinationStoreId, quantity, status, comment } = data;

    const newTransfer = await prisma.transfer.create({
      data: {
        id, 
        productId,
        sourceStoreId,
        destinationStoreId,
        quantity,
        status,
        comment,
      },
    });

    if (!newTransfer) {
      throw new BadRequestError('Failed to create transfer');
    }

    return newTransfer;
  }

  static async updateTransferById(data) {
    const { id, productId, sourceStoreId, destinationStoreId, quantity, status, comment } = data;

    const updatedTransfer = await prisma.transfer.update({
      where: { id },
      data: {
        productId,
        sourceStoreId,
        destinationStoreId,
        quantity,
        status,
        comment,
      },
    });

    if (!updatedTransfer) {
      throw new NotFoundError('Transfer not found');
    }

    return updatedTransfer;
  }

  static async deleteTransferById(id) {
    const transferExists = await prisma.transfer.findUnique({
      where: { id },
    });

    if (!transferExists) {
      throw new NotFoundError('Transfer not found');
    }

    const deletedTransfer = await prisma.transfer.delete({
      where: { id },
    });

    return deletedTransfer;
  }
}

export default TransferService;
