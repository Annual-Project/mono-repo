import prisma from '../config/db.js';

import NotFoundError from '../exceptions/NotFoundError.js';
import BadRequestError from '../exceptions/BadRequestError.js';

class ProductService {
  static async getAllProducts(limit, offset) {
    return await prisma.product.findMany({
      take: limit,
      skip: offset,
    });
  }

  static async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  static async createProduct(data) {
    const { id, name, price, description, categoryId } = data;

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestError('Invalid category ID');
      }
    }

    return await prisma.product.create({
      data: {
        id,
        name,
        price,
        description,
        categoryId,
      },
    });
  }

  static async updateProductById(data) {
    const { id, name, price, description, categoryId } = data;

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestError('Invalid category ID');
      }
    }

    return await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        categoryId,
      },
    });
  }

  static async deleteProductById(id) {
    const productExists = await prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundError('Product not found');
    }

    return await prisma.product.delete({
      where: { id },
    });
  }
}

export default ProductService;
