import { Router } from 'express';
import productsController from '../controllers/products.js';
import categoriesController from '../controllers/categories.js';
import validateData from '../middlewares/validations.js';
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from '../validations/products.js';
import { createCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema } from '../validations/categories.js';
import errorHandler from '../middlewares/errors.js';

import NotFoundError from '../../products-service/exceptions/NotFoundError.js';

const router = Router();

// GET all products
router.get('/api/v1/products', errorHandler(productsController.getAllProducts));

// GET a product by ID
router.get('/api/v1/products/:id', validateData(getProductSchema, 'params'), errorHandler(productsController.getProductById));

// POST a new product
router.post('/api/v1/products', validateData(createProductSchema, 'body'), errorHandler(productsController.createProduct));

// PUT update a product by ID
router.put('/api/v1/products', validateData(updateProductSchema, 'body'), errorHandler(productsController.updateProductById));

// DELETE a product by ID
router.delete('/api/v1/products/:id', validateData(deleteProductSchema, 'params'), errorHandler(productsController.deleteProductById));



// GET all categories
router.get('/api/v1/categories', errorHandler(categoriesController.getAllCategories));

// GET a category by ID
router.get('/api/v1/categories/:id', validateData(getCategorySchema, 'params'), errorHandler(categoriesController.getCategoryById));

// POST a new category
router.post('/api/v1/categories',  validateData(createCategorySchema, 'body'), errorHandler(categoriesController.createCategory));

// PUT update a category by ID
router.put('/api/v1/categories',  validateData(updateCategorySchema, 'body'), errorHandler(categoriesController.updateCategoryById));

// DELETE a category by ID
router.delete('/api/v1/categories/:id', validateData(deleteCategorySchema, 'params'), errorHandler(categoriesController.deleteCategoryById));

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(
    new NotFoundError('Resource not found'),
  );
});

export default router;
