import prisma from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';

const historyController = {
  // GET all stock history records
 async getAllHistory(_, res) {
      const historyRecords = await prisma.stockHistory.findMany({
        orderBy: { createdAt: 'desc' }
      });

      if (!historyRecords || historyRecords.length === 0) {
        throw new NotFoundError('No stock history records found');
      }

      res.status(200).json(historyRecords);
    },

  // GET a single history record by ID
  async getHistoryById(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new NotFoundError('Invalid history record ID');
    }
      const record = await prisma.stockHistory.findUnique({
        where: { id: parseInt(id) }
      });

      if (!record) {
        throw new NotFoundError('History record not found');
      }

      res.status(200).json(record);
    },

  // GET history records by productId
  async getHistoryByProductId(req, res) {
    const { productId } = req.params;

      const histories = await prisma.stockHistory.findMany({
        where: { productId: parseInt(productId) },
        orderBy: { createdAt: 'desc' }
      });

      if (!histories || histories.length === 0) {
        throw new NotFoundError('No stock history found for this product');
      }

      res.status(200).json(histories);
    },

  // CREATE a new history record
  async createHistory(req, res) {
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
    },

  // UPDATE a history record by ID
  async updateHistoryById(req, res) {
    const { id, productId, storeId, action, quantity, comment } = req.body;

      const updatedRecord = await prisma.stockHistory.update({
        where: { id },
        data: {
          productId,
          storeId,
          action,
          quantity,
          comment,
          updatedAt: new Date(),
        }
      });

      res.status(200).json(updatedRecord);
    },

  // DELETE a history record by ID
  async deleteHistoryById(req, res) {
    const { id } = req.params;

      await prisma.stockHistory.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({ message: `History record with ID ${id} has been successfully deleted.` });
    }
};

export default historyController;
