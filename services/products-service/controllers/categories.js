import prisma from '../config/db.js'

const categoriesController = {

    async getAllCategories(req, res) {
        try {
            const categories = await prisma.category.findMany();

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    },

    async getCategoryById(req, res) {
        const { id } = req.params;

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

        res.status(201).json({
          message: 'Category created successfully',
          data: newCategory,
        });
    } catch (error) {
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
    }
},

async updateCategoryById(req, res) {
    const { id, name, description } = req.body;

    try {
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name,
                description,
            }
        });

        res.status(200).json({
          message: 'Category updated successfully',
          data: updatedCategory,
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
    }
},

async deleteCategoryById(req, res) {
    const { id } = req.params;

    try {
        const categoryExists = await prisma.category.findUnique({
          where: { id },
        });

        if (!categoryExists) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }

        const deletedCategory = await prisma.category.delete({
            where: { id }
        });

        res.status(200).json({
          message: `Category with ID ${id} has been successfully deleted.`,
          data: deletedCategory,
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Category not found' });
        }
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
    }
}
};

export default categoriesController;