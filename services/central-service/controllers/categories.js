import prisma from '../config/db.js'
import NotFoundError from '../exceptions/NotFoundError.js';

const categoriesController = {

    async getAllCategories(req, res) {
        const { limit, offset } = req.query;

        const categories = await prisma.category.findMany({
            take: limit,
            skip: offset,
        });

            res.status(200).json(categories);
    },

    async getCategoryById(req, res) {
        const { id } = req.params;
            const category = await prisma.category.findUnique({
                where: { id: parseInt(id) }
            });

            if (!category) {
                throw new NotFoundError('Category not found');
            }

            res.status(200).json(category);
    },
    
    async createCategory(req, res) {
        const { name, description } = req.body;

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
    },

    async updateCategoryById(req, res) {
        const { id, name, description } = req.body;

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
    },

    async deleteCategoryById(req, res) {
        const { id } = req.params;

        const categoryExists = await prisma.category.findUnique({
          where: { id },
        });

        if (!categoryExists) {
            throw new NotFoundError('Category not found');
        }

        const deletedCategory = await prisma.category.delete({
            where: { id }
        });

        res.status(200).json({
          message: `Category with ID ${id} has been successfully deleted.`,
          data: deletedCategory,
        });
    },

};

export default categoriesController;
