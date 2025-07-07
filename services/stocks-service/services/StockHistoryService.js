import prisma from '../config/db.js';

import { sendToQueue } from '../../../shared/config/rabbitmq.js';

import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

class StockHistoryService {
  static async getAllHistory(limit, offset) {
    return await prisma.stockHistory.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getHistoryById(id) {
    const record = await prisma.stockHistory.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundError('History record not found');
    }

    return record;
  }

  static async getHistoryByProductId(productId) {
    const histories = await prisma.stockHistory.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    return histories;
  }

  static async createHistory(data) {
    const { productId, storeId, action, quantity, comment } = data;

    const newStockHistory = await prisma.stockHistory.create({
      data: {
        productId,
        storeId,
        action,
        quantity,
        comment,
      },
    });

    if (!newStockHistory) {
      throw new BadRequestError('Failed to create stock history');
    }

    sendToQueue('stockHistory.create', newStockHistory);

    return newStockHistory;
  }

  static async updateHistoryById(data) {
    const { id, productId, storeId, action, quantity, comment } = data;

    const updatedStockHistory = await prisma.stockHistory.update({
      where: { id },
      data: {
        productId,
        storeId,
        action,
        quantity,
        comment,
      },
    });

    if (!updatedStockHistory) {
      throw new NotFoundError('History record not found');
    }

    sendToQueue('stockHistory.update', updatedStockHistory);

    return updatedStockHistory;
  }

  static async deleteHistoryById(id) {
    const recordExists = await prisma.stockHistory.findUnique({
      where: { id },
    });

    if (!recordExists) {
      throw new NotFoundError('History record not found');
    }

    const deletedStockHistory = await prisma.stockHistory.delete({
      where: { id },
    });

    if (!deletedStockHistory) {
      throw new BadRequestError('Failed to delete stock history');
    }

    sendToQueue('stockHistory.delete', deletedStockHistory);

    return deletedStockHistory;
  }
}

export default StockHistoryService;
