import prisma from '../config/db.js';

import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

class StoreService {
  static async getAllStores(limit, offset) {
    return await prisma.store.findMany({
      take: limit,
      skip: offset,
    });
  }

  static async getStoreById(id) {
    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundError('Store not found');
    }

    return store;
  }

  static async createStore(data) {
    const { name, description } = data;

    const newStore = await prisma.store.create({
      data: {
        name,
        description,
      },
    });

    if (!newStore) {
      throw new BadRequestError('Failed to create store');
    }

    return newStore;
  }

  static async updateStoreById(data) {
    const { id, name, description } = data;

    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    if (!updatedStore) {
      throw new NotFoundError('Store not found');
    }

    return updatedStore;
  }

  static async deleteStoreById(id) {
    const storeExists = await prisma.store.findUnique({
      where: { id },
    });

    if (!storeExists) {
      throw new NotFoundError('Store not found');
    }

    return await prisma.store.delete({
      where: { id },
    });
  }
}

export default StoreService;
