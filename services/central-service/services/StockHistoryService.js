import prisma from '../config/db.js';

import NotFoundError from '../exceptions/NotFoundError.js';

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

    return await prisma.stockHistory.create({
      data: {
        productId,
        storeId,
        action,
        quantity,
        comment,
      },
    });
  }

  static async updateHistoryById(data) {
    const { id, productId, storeId, action, quantity, comment } = data;

    return await prisma.stockHistory.update({
      where: { id },
      data: {
        productId,
        storeId,
        action,
        quantity,
        comment,
      },
    });
  }

  static async deleteHistoryById(id) {
    const recordExists = await prisma.stockHistory.findUnique({
      where: { id },
    });

    if (!recordExists) {
      throw new NotFoundError('History record not found');
    }

    return await prisma.stockHistory.delete({
      where: { id },
    });
  }
}

export default StockHistoryService;
