import prisma from '../config/db.js'

const productsController = {

    async getAllProducts(req, res) {
        const products = await prisma.product.findMany();

        res.status(200).json(products);
    },
    
    async getProductById(req, res) {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
        }

        res.status(200).json(product);
    },

    async createProduct(req, res) {
        const { name, price, description, categoryId } = req.body;

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
        
    },

    async updateProductById(req, res) {
        const { id, name, price, description, categoryId } = req.body;

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
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        
    },

    async deleteProductById(req, res) {
    const { id } = req.params;
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
    } 

};

export default productsController;
