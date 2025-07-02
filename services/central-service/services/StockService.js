import prisma from '../config/db.js';

import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

class StockService {
  static async getAllStocks(limit, offset) {
    return await prisma.stock.findMany({
      take: limit,
      skip: offset,
    });
  }

  static async getStockById(id) {
    const stock = await prisma.stock.findUnique({
      where: { id },
    });

    if (!stock) {
      throw new NotFoundError('Stock not found');
    }

    return stock;
  }

  static async createStock(data) {
    const { productId, storeId, quantityAvailable, criticalThreshold } = data;

    const newStock = await prisma.stock.create({
      data: {
        productId,
        storeId,
        quantityAvailable,
        criticalThreshold,
      },
    });

    if (!newStock) {
      throw new BadRequestError('Failed to create stock');
    }

    return newStock;
  }

  static async updateStockById(data) {
    const { id, productId, storeId, quantityAvailable, criticalThreshold } = data;

    const updatedStock = await prisma.stock.update({
      where: { id },
      data: {
        productId,
        storeId,
        quantityAvailable,
        criticalThreshold,
      },
    });

    if (!updatedStock) {
      throw new NotFoundError('Stock not found');
    }

    return updatedStock;
  }

  static async deleteStockById(id) {
    const stockExists = await prisma.stock.findUnique({
      where: { id },
    });

    if (!stockExists) {
      throw new NotFoundError('Stock not found');
    }

    const deletedStock = await prisma.stock.delete({
      where: { id },
    });

    return deletedStock;
  }
}

export default StockService;
