import StockHistoryService from '../services/StockHistoryService.js';

class StockHistoryController {
  static async getAllHistory(req, res) {
    const { limit, offset } = req.query;
    const historyRecords = await StockHistoryService.getAllHistory(limit, offset);
    res.status(200).json(historyRecords);
  }

  static async getHistoryById(req, res) {
    const { id } = req.params;
    const record = await StockHistoryService.getHistoryById(id);
    res.status(200).json(record);
  }

  static async getHistoryByProductId(req, res) {
    const { productId } = req.params;
    const histories = await StockHistoryService.getHistoryByProductId(productId);
    res.status(200).json(histories);
  }

  static async createHistory(req, res) {
    const newRecord = await StockHistoryService.createHistory(req.body);
    res.status(201).json(newRecord);
  }

  static async updateHistoryById(req, res) {
    const updatedRecord = await StockHistoryService.updateHistoryById(req.body);
    res.status(200).json(updatedRecord);
  }

  static async deleteHistoryById(req, res) {
    const { id } = req.params;
    await StockHistoryService.deleteHistoryById(id);
    res.status(200).json({ message: `History record with ID ${id} has been successfully deleted.` });
  }
}

export default StockHistoryController;
