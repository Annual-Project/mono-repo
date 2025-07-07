import prisma from '../config/db.js';

import { sendToQueue } from '../../../shared/config/rabbitmq.js';

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
    const { name, price, description, categoryId } = data;

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestError('Invalid category ID');
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        description,
        categoryId,
      },
    });

    if (!newProduct) {
      throw new BadRequestError('Failed to create product');
    }

    sendToQueue('product.create', newProduct);

    return newProduct;
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

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        categoryId,
      },
    });

    if (!updatedProduct) {
      throw new NotFoundError('Product not found');
    }

    sendToQueue('product.update', updatedProduct);

    return updatedProduct;
  }

  static async deleteProductById(id) {
    const productExists = await prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundError('Product not found');
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    if (!deletedProduct) {
      throw new BadRequestError('Failed to delete product');
    }

    sendToQueue('product.delete', deletedProduct);

    return deletedProduct;
  }
}

export default ProductService;
