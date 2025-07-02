import CategoryService from '../services/CategoryService.js';

class CategoryController {
  static async getAllCategories(req, res) {
    const { limit, offset } = req.query;
    const categories = await CategoryService.getAllCategories(limit, offset);
    res.status(200).json(categories);
  }

  static async getCategoryById(req, res) {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);
    res.status(200).json(category);
  }

  static async createCategory(req, res) {
    const newCategory = await CategoryService.createCategory(req.body);
    res.status(201).json({
      message: 'Category created successfully',
      data: newCategory,
    });
  }

  static async updateCategoryById(req, res) {
    const updatedCategory = await CategoryService.updateCategoryById(req.body);
    res.status(200).json({
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  }

  static async deleteCategoryById(req, res) {
    const { id } = req.params;
    const deletedCategory = await CategoryService.deleteCategoryById(id);
    res.status(200).json({
      message: `Category with ID ${id} has been successfully deleted.`,
      data: deletedCategory,
    });
  }
}

export default CategoryController;
