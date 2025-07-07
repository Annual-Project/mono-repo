import prisma from '../config/db.js';

import { sendToQueue } from '../../../shared/config/rabbitmq.js';

import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

class CategoryService {
  static async getAllCategories(limit, offset) {
    return await prisma.category.findMany({
      take: limit,
      skip: offset,
    });
  }

  static async getCategoryById(id) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  static async createCategory(data) {
    const { name, description } = data;

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    if (!newCategory) {
      throw new BadRequestError('Failed to create category');
    }

    sendToQueue('category.create', newCategory);

    return newCategory;
  }

  static async updateCategoryById(data) {
    const { id, name, description } = data;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    if (!updatedCategory) {
      throw new NotFoundError('Category not found');
    }

    sendToQueue('category.update', updatedCategory);

    return updatedCategory;
  }

  static async deleteCategoryById(id) {
    const categoryExists = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      throw new NotFoundError('Category not found');
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    if (!deletedCategory) {
      throw new BadRequestError('Failed to delete category');
    }

    sendToQueue('category.delete', deletedCategory);

    return deletedCategory;
  }
}

export default CategoryService;
