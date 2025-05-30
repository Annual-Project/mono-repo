import prisma from '../config/db.js'

const productsController = {

    async getAllProducts(req, res) {
        try {
            const products = await prisma.product.findMany();

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },
    
    async getProductById(req, res) {
        const { id } = req.params;

        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) }
            });

            if (!product) {
                return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },

    async createProduct(req, res) {
        const { name, price, description, categoryId } = req.body;

        try {
            if (categoryId) {
              const categoryExists = await prisma.category.findUnique({
                  where: { id: parseInt(categoryId) },
              });

              if (!categoryExists) {
                  return res.status(400).json({
                      error: 'BAD_REQUEST',
                      message: 'Invalid category ID',
                  });
              }
            }

            const newProduct = await prisma.product.create({
                data: {
                    name,
                    price,
                    description,
                    categoryId,
                }
            });

            res.status(201).json({
              message: 'Product created successfully',
              data: newProduct,
            });
        } catch (error) {
            if (error.code === 'P2025') {
              return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
            }
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },

    async updateProductById(req, res) {
        const { id, name, price, description, categoryId } = req.body;

        try {
            if (categoryId) {
              const categoryExists = await prisma.category.findUnique({
                  where: { id: parseInt(categoryId) },
              });

              if (!categoryExists) {
                  return res.status(400).json({
                      error: 'BAD_REQUEST',
                      message: 'Invalid category ID',
                  });
              }
            }

            const updatedProduct = await prisma.product.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    price,
                    description,
                    categoryId,
                }
            });

            res.status(200).json({
              message: 'Product updated successfully',
              data: updatedProduct,
            });
        } catch (error) {
            if (error.code === 'P2025') {
              return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
            }
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },

    async deleteProductById(req, res) {
        const { id } = req.params;

        try {
            const productExists = await prisma.product.findUnique({
              where: { id },
            });

            if (!productExists) {
                return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
            }

            // Leve une exception si le produit n'existe pas
            const deletedProduct = await prisma.product.delete({
                where: { id }
            });

            res.status(200).json({ message: 'Product deleted successfully', data: deletedProduct });
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    }
};

export default productsController;
