import prisma from '../config/db.js'

const categoriesController = {

    async getAllCategories(req, res) {
        try {
            const categories = await prisma.category.findMany();

            if (!categories || categories.length === 0) {
                return res.status(404).json({ error: 'NOT_FOUND', message: 'No categories found' });
            }

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },

    async getCategoryById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid category ID' });
        }

        try {
            const category = await prisma.category.findUnique({
                where: { id: parseInt(id) }
            });

            if (!category) {
                return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
            }

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },
    
    async createCategory(req, res) {
        const { name, description } = req.body;

    try {
        const newCategory = await prisma.category.create({
            data: {
                name,
                description, 
            }
        });

        if (!newCategory) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'Failed to create category' });
        }

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
    }
},

async updateCategoryById(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid category ID' });
    }

    try {
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
            }
        });

        if (!updatedCategory) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
    }
},

async deleteCategoryById(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid category ID' });
    }

    try {
        const deletedCategory = await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        if (!deletedCategory) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }

        res.status(200).json({ message: `Category with ID ${id} has been successfully deleted.` });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
    }
}
};

export default categoriesController;