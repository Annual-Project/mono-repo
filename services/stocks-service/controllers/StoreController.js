import StoreService from '../services/StoreService.js';

class StoreController {
  static async getAllStores(req, res) {
    // const { limit, offset } = req.query;
    const { limit, offset } = req.validated.query;
    const stores = await StoreService.getAllStores(limit, offset);
    res.status(200).json(stores);
  }

  static async getStoreById(req, res) {
    const { id } = req.validated.params;
    const store = await StoreService.getStoreById(id);
    res.status(200).json(store);
  }

  static async createStore(req, res) {
    const newStore = await StoreService.createStore(req.body);
    res.status(201).json(newStore);
  }

  static async updateStoreById(req, res) {
    const updatedStore = await StoreService.updateStoreById(req.body);
    res.status(200).json(updatedStore);
  }

  static async deleteStoreById(req, res) {
    const { id } = req.params;
    await StoreService.deleteStoreById(id);
    res.status(200).json({ message: `Store with ID ${id} has been successfully deleted.` });
  }
}

export default StoreController;
