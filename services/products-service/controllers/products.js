import prisma from '../config/db.js'

const productsController = {

    async getAllProducts(req, res) {
        try {
            const products = await prisma.product.findMany();

            if (!products || products.length === 0) {
                return res.status(404).json({ error: 'NOT_FOUND', message: 'No products found' });
            }

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },
    
    async getProductById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid product ID' });
        }

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

        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid category ID' });
        }

        if (!name || !price) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Name and price are required' });
        }

        try {
            const newProduct = await prisma.product.create({
                data: {
                    name,
                    price,
                    description,
                    categoryId: parseInt(categoryId),
                }
            });

            if (!newProduct) {
                return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to create product' });
            }

            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },

    async updateProductById(req, res) {
        const { id } = req.params;
        const { name, price, description, categoryId } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid product ID' });
        }

        try {
            const updatedProduct = await prisma.product.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    price,
                    description,
                    categoryId,
                }
            });

            if (!updatedProduct) {
                return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },

    async deleteProductById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid product ID' });
        }

        try {
            const deletedProduct = await prisma.product.delete({
                where: { id: parseInt(id) }
            });

            if (!deletedProduct) {
                return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    }
};

export default productsController;
