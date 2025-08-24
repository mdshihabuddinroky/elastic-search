const ProductService = require('../services/ProductService');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // Create/Index a new product
  async createProduct(req, res) {
    try {
      const result = await this.productService.createProduct(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: result.product,
        elasticsearchResponse: result.elasticsearchResponse
      });
    } catch (error) {
      console.error('Controller error - createProduct:', error.message);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Get a product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Controller error - getProductById:', error.message);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Get all products with pagination
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      
      // Validate pagination parameters
      if (page < 1 || size < 1 || size > 100) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Page must be >= 1, size must be between 1 and 100'
        });
      }

      const result = await this.productService.getAllProducts(page, size);
      
      res.status(200).json({
        success: true,
        data: result.products,
        pagination: {
          page: result.page,
          size: result.size,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      console.error('Controller error - getAllProducts:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Search products
  async searchProducts(req, res) {
    try {
      const { q, category, brand, minPrice, maxPrice, minRating, inStock, page, size } = req.query;
      
      const pageNum = parseInt(page) || 1;
      const sizeNum = parseInt(size) || 10;
      
      // Validate pagination parameters
      if (pageNum < 1 || sizeNum < 1 || sizeNum > 100) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Page must be >= 1, size must be between 1 and 100'
        });
      }

      // Build filters object
      const filters = {};
      if (category) filters.category = category;
      if (brand) filters.brand = brand;
      if (minPrice !== undefined) filters.minPrice = parseFloat(minPrice);
      if (maxPrice !== undefined) filters.maxPrice = parseFloat(maxPrice);
      if (minRating !== undefined) filters.minRating = parseFloat(minRating);
      if (inStock !== undefined) filters.inStock = inStock === 'true';

      const result = await this.productService.searchProducts(q, filters, pageNum, sizeNum);
      
      res.status(200).json({
        success: true,
        data: result.products,
        pagination: {
          page: result.page,
          size: result.size,
          total: result.total,
          totalPages: result.totalPages
        },
        aggregations: result.aggregations,
        searchQuery: q || null,
        filters: filters
      });
    } catch (error) {
      console.error('Controller error - searchProducts:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Update a product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await this.productService.updateProduct(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: result.product,
        elasticsearchResponse: result.elasticsearchResponse
      });
    } catch (error) {
      console.error('Controller error - updateProduct:', error.message);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Product not found'
        });
      }

      if (error.message.includes('Validation failed')) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await this.productService.deleteProduct(id);
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        elasticsearchResponse: result.elasticsearchResponse
      });
    } catch (error) {
      console.error('Controller error - deleteProduct:', error.message);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Delete the entire index
  async deleteIndex(req, res) {
    try {
      const result = await this.productService.deleteIndex();
      
      res.status(200).json({
        success: true,
        message: 'Index deleted successfully',
        elasticsearchResponse: result.elasticsearchResponse
      });
    } catch (error) {
      console.error('Controller error - deleteIndex:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Get index statistics
  async getIndexStats(req, res) {
    try {
      const stats = await this.productService.getIndexStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Controller error - getIndexStats:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // Bulk index products
  async bulkIndexProducts(req, res) {
    try {
      const { products } = req.body;
      
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Products array is required and must not be empty'
        });
      }

      if (products.length > 1000) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Cannot bulk index more than 1000 products at once'
        });
      }

      const result = await this.productService.bulkIndexProducts(products);
      
      res.status(201).json({
        success: true,
        message: `Bulk indexed ${result.count} products successfully`,
        count: result.count,
        elasticsearchResponse: result.elasticsearchResponse
      });
    } catch (error) {
      console.error('Controller error - bulkIndexProducts:', error.message);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
}

module.exports = ProductController;
