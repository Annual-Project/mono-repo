import BadRequestError from "../exceptions/BadRequestError.js";

class AggregatedCategoryService {

  // Methode pour les categories de la page admin
  static async getAggregatedCategoriesAdmin() {
    // 1. Récupération de toutes les catégories
    const categoriesResponse = await fetch('http://products_service:3000/api/v1/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!categoriesResponse.ok) {
      throw new BadRequestError('Failed to fetch categories');
    }

    const categories = await categoriesResponse.json();

    // 2. Récupération de tous les produits
    const productsResponse = await fetch('http://products_service:3000/api/v1/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!productsResponse.ok) {
      throw new BadRequestError('Failed to fetch products');
    }

    const products = await productsResponse.json();

    // 3. Création d'une Map pour regrouper les produits par categoryId
    const productsByCategory = new Map();
    
    products.forEach(product => {
      if (!productsByCategory.has(product.categoryId)) {
        productsByCategory.set(product.categoryId, []);
      }
      productsByCategory.get(product.categoryId).push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price
      });
    });

    // 4. Association des produits avec leurs catégories
    const aggregatedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      products: productsByCategory.get(category.id) || []
    }));

    // 5. Calcul des statistiques
    const categoryCount = categories.length;
    const productCount = products.length;

    return {
      aggregatedCategories,
      categoryCount,
      productCount
    };
  }

}

export default AggregatedCategoryService;
