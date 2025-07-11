import ProductService from '../services/ProductService.js';

class ProductController {
  static async getAllProducts(req, res) {
    const { limit, offset } = req.validated.query;
    const products = await ProductService.getAllProducts(limit, offset);
    res.status(200).json(products);
  }

  static async getProductById(req, res) {
    const { id } = req.validated.params;
    const product = await ProductService.getProductById(id);
    res.status(200).json(product);
  }

  // static async getProductsByStoreId(req, res) {
  //   const { id } = req.params;
  //   const products = await ProductService.getProductsByStoreId(id);
  //   res.status(200).json(products);
  // }

  // static async countProductsAndCategoriesByStoreId(req, res) {
  //   const { id } = req.validated.params;
  //   console.log('Counting products and categories for store ID:', id);
  //   const counts = await ProductService.countProductsAndCategoriesByStoreId(id);
  //   res.status(200).json(counts);
  // }

  static async createProduct(req, res) {
    const newProduct = await ProductService.createProduct(req.validated.body);
    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct,
    });
  }

  static async updateProductById(req, res) {
    const { id } = req.validated.params;
    const updatedProduct = await ProductService.updateProductById({ id, ...req.validated.body });
    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  }

  static async deleteProductById(req, res) {
    const { id } = req.validated.params;
    const deletedProduct = await ProductService.deleteProductById(id);
    res.status(200).json({ message: 'Product deleted successfully', data: deletedProduct });
  }
}

export default ProductController;
