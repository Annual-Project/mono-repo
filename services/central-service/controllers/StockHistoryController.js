import prisma from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class StockHistoryController {
  // GET all stock history records
  static async getAllHistory(req, res) {
    const { limit, offset } = req.query;

    const historyRecords = await prisma.stockHistory.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(historyRecords);
  }

  // GET a single history record by ID
  static async getHistoryById(req, res) {
    const { id } = req.params;

    const record = await prisma.stockHistory.findUnique({
      where: { id }
    });

    if (!record) {
      throw new NotFoundError('History record not found');
    }

    res.status(200).json(record);
  }

  // GET history records by productId
  static async getHistoryByProductId(req, res) {
    const { productId } = req.params;

    const histories = await prisma.stockHistory.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    });

    if (!histories || histories.length === 0) {
      throw new NotFoundError('No stock history found for this product');
    }

    res.status(200).json(histories);
  }

  // CREATE a new history record
  static async createHistory(req, res) {
    const { productId, storeId, action, quantity, comment } = req.body;

    const newRecord = await prisma.stockHistory.create({
      data: {
        productId,
        storeId,
        action,
        quantity,
        comment,
      }
    });

    res.status(201).json(newRecord);
  }

  // UPDATE a history record by ID
  static async updateHistoryById(req, res) {
    const { id, productId, storeId, action, quantity, comment } = req.body;

    const updatedRecord = await prisma.stockHistory.update({
      where: { id },
      data: {
        productId,
        storeId,
        action,
        quantity,
        comment,
      }
    });

    res.status(200).json(updatedRecord);
  }

  // DELETE a history record by ID
  static async deleteHistoryById(req, res) {
    const { id } = req.params;

    await prisma.stockHistory.delete({
      where: { id }
    });

    res.status(200).json({ message: `History record with ID ${id} has been successfully deleted.` });
  }
};

export default StockHistoryController;
