import prisma from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
const stockController = {
  // GET all stocks
  async getAllStocks(req, res) {
      const { limit, offset } = req.query;

      const stocks = await prisma.stock.findMany({
        take: limit,
        skip: offset,
      });

      res.status(200).json(stocks);
    },

  // GET stock by ID
  async getStockById(req, res) {
    const { id } = req.params;

      const stock = await prisma.stock.findUnique({
        where: { id }
      });

      if (!stock) {
        throw new NotFoundError('Stock not found');
      }
      res.status(200).json(stock);
    },

  // CREATE a new stock
  async createStock(req, res) {
    const { productId, storeId, quantityAvailable, criticalThreshold } = req.body;
      const newStock = await prisma.stock.create({
        data: {
          productId,
          storeId,
          quantityAvailable,
          criticalThreshold,
        }
      });

      if (!newStock) {
        throw new BadRequestError('Failed to create stock');
      }
      res.status(201).json(newStock);
    },

  // UPDATE stock by ID
  async updateStockById(req, res) {
    const { id, productId, storeId, quantityAvailable, criticalThreshold } = req.body;

      const updatedStock = await prisma.stock.update({
        where: { id },
        data: {
          productId,
          storeId,
          quantityAvailable,
          criticalThreshold,
          updatedAt: new Date(),
        }
      });

      if (!updatedStock) {
        throw new NotFoundError('Stock not found');
      }
      res.status(200).json(updatedStock);
    },

  // DELETE stock by ID
  async deleteStockById(req, res) {
    const { id } = req.params;

    const deletedStock = await prisma.stock.delete({
        where: { id }
      });

      if (!deletedStock) {
        throw new NotFoundError('Stock not found');
      }
      res.status(200).json({ message: `Stock with ID ${id} has been successfully deleted.` });
    } 
  }

export default stockController;
