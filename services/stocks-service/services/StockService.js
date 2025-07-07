import prisma from '../config/db.js';

import { sendToQueue } from '../../../shared/config/rabbitmq.js';

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

    sendToQueue('stock.create', newStock);

    // Si un stock est faible, envoyer une alerte
    if (newStock.quantityAvailable < newStock.criticalThreshold) {
      const data = await prisma.store.findUnique({
        where: { id: newStock.storeId },
      });

      if (!data) {
        console.error('Store not found for stock alert');
        return newStock;
      }

      sendToQueue('stock.alert', {
        message: 'Stock is below critical threshold',
        data,
      });
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

    sendToQueue('stock.update', updatedStock);

    // Si un stock est faible, envoyer une alerte
    if (updatedStock.quantityAvailable < updatedStock.criticalThreshold) {
      const data = await prisma.store.findUnique({
        where: { id: updatedStock.storeId },
      });

      if (!data) {
        console.error('Store not found for stock alert');
        return updatedStock;
      }

      sendToQueue('stock.alert', {
        message: 'Stock is below critical threshold',
        data,
      });
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

    if (!deletedStock) {
      throw new BadRequestError('Failed to delete stock');
    }

    sendToQueue('stock.delete', deletedStock);

    return deletedStock;
  }
}

export default StockService;
