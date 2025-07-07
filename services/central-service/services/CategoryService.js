import prisma from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';

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
    const { id, name, description } = data;

    return await prisma.category.create({
      data: {
        id,
        name,
        description,
      },
    });
  }

  static async updateCategoryById(data) {
    const { id, name, description } = data;

    return await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
  }

  static async deleteCategoryById(id) {
    const categoryExists = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      throw new NotFoundError('Category not found');
    }

    return await prisma.category.delete({
      where: { id },
    });
  }
}

export default CategoryService;
