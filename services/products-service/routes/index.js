import { Router } from 'express';

const router = Router();

// GET all products
router.get('/api/v1/products', (req, res) => {
  res.send('Get all products');
});

// GET a product by ID
router.get('/api/v1/products/:id', (req, res) => {
  res.send(`Get product with ID ${req.params.id}`);
});

// POST a new product
router.post('/api/v1/products', (req, res) => {
  res.send('Create a new product');
});

// PUT update a product by ID
router.put('/api/v1/products/:id', (req, res) => {
  res.send(`Update product with ID ${req.params.id}`);
});

// GET all categories
router.get('/api/v1/categories', (req, res) => {
  res.send('Get all categories');
});

// GET a category by ID
router.get('/api/v1/categories/:id', (req, res) => {
  res.send(`Get category with ID ${req.params.id}`);
});

// POST a new category
router.post('/api/v1/categories', (req, res) => {
  res.send('Create a new category');
});

// PUT update a category by ID
router.put('/api/v1/categories/:id', (req, res) => {
  res.send(`Update category with ID ${req.params.id}`);
});

//404 Not Found
router.use((req, res, next) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Resource not found',
  });
});

export default router;

//Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     error: err.code || 'INTERNAL_SERVER_ERROR',
//     message: err.message || 'Something went wrong',
//   });
// });
