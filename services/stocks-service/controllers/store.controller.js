import prisma from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

const storeController = {
  // GET all stores
  async getAllStores(req, res) {
    const { limit, offset } = req.query;

    const stores = await prisma.store.findMany({
      take: limit,
      skip: offset,
    });

    res.status(200).json(stores);
  },

  // GET store by ID
  async getStoreById(req, res) {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundError('Store not found');
    }

    res.status(200).json(store);
  },

  // CREATE a new store
  async createStore(req, res) {
    const { name, description } = req.body;

    const newStore = await prisma.store.create({
      data: {
        name,
        description,
      },
    });

    if (!newStore) {
      throw new BadRequestError('Failed to create store');
    }

    res.status(201).json(newStore);
  },

  // UPDATE store by ID
  async updateStoreById(req, res) {
    const { id, name, description } = req.body;

    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
    });

    if (!updatedStore) {
      throw new NotFoundError('Store not found');
    }

    res.status(200).json(updatedStore);
  },

  // DELETE store by ID
  async deleteStoreById(req, res) {
    const { id } = req.params;

    const deletedStore = await prisma.store.delete({
      where: { id},
    });

    if (!deletedStore) {
      throw new NotFoundError('Store not found');
    }

    res.status(200).json({ message: `Store with ID ${id} has been successfully deleted.` });
  },
};

export default storeController;
