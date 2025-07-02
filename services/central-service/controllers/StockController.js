import StockService from '../services/StockService.js';

class StockController {
  static async getAllStocks(req, res) {
    const { limit, offset } = req.query;
    const stocks = await StockService.getAllStocks(limit, offset);
    res.status(200).json(stocks);
  }

  static async getStockById(req, res) {
    const { id } = req.params;
    const stock = await StockService.getStockById(id);
    res.status(200).json(stock);
  }

  static async createStock(req, res) {
    const newStock = await StockService.createStock(req.body);
    res.status(201).json(newStock);
  }

  static async updateStockById(req, res) {
    const updatedStock = await StockService.updateStockById(req.body);
    res.status(200).json(updatedStock);
  }

  static async deleteStockById(req, res) {
    const { id } = req.params;
    await StockService.deleteStockById(id);
    res.status(200).json({ message: `Stock with ID ${id} has been successfully deleted.` });
  }
}

export default StockController;
