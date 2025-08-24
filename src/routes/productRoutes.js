const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();
const productController = new ProductController();

/**
 * @swagger
 * /api/products/health:
 *   get:
 *     summary: Health check for products API
 *     description: Check if the products API is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Products API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Products API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products with advanced filters
 *     description: Search products using Elasticsearch with text search, filters, and aggregations
 *     tags: [Search]
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/Category'
 *       - $ref: '#/components/parameters/Brand'
 *       - $ref: '#/components/parameters/MinPrice'
 *       - $ref: '#/components/parameters/MaxPrice'
 *       - $ref: '#/components/parameters/MinRating'
 *       - $ref: '#/components/parameters/InStock'
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Size'
 *     responses:
 *       200:
 *         description: Products found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', productController.searchProducts.bind(productController));

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Get Elasticsearch index statistics
 *     description: Retrieve statistics about the products index including document count and storage size
 *     tags: [Index Management]
 *     responses:
 *       200:
 *         description: Index statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndexStats'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', productController.getIndexStats.bind(productController));

/**
 * @swagger
 * /api/products/index:
 *   delete:
 *     summary: Delete entire products index
 *     description: Remove all products and the Elasticsearch index (⚠️ DESTRUCTIVE OPERATION)
 *     tags: [Index Management]
 *     responses:
 *       200:
 *         description: Index deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Products index deleted successfully'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/index', productController.deleteIndex.bind(productController));

/**
 * @swagger
 * /api/products/bulk:
 *   post:
 *     summary: Bulk index multiple products
 *     description: Efficiently index multiple products at once using Elasticsearch bulk API
 *     tags: [Bulk Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkProductRequest'
 *           example:
 *             products:
 *               - name: "MacBook Pro"
 *                 description: "Professional laptop for developers and designers"
 *                 category: "Electronics"
 *                 brand: "Apple"
 *                 price: 1999.99
 *                 stock: 25
 *                 rating: 4.9
 *                 tags: ["laptop", "development", "professional"]
 *               - name: "iPhone 15"
 *                 description: "Latest iPhone with advanced features"
 *                 category: "Electronics"
 *                 brand: "Apple"
 *                 price: 799.99
 *                 stock: 100
 *                 rating: 4.7
 *                 tags: ["smartphone", "5G", "camera"]
 *     responses:
 *       200:
 *         description: Products bulk indexed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkProductResponse'
 *       400:
 *         description: Validation error in product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/bulk', productController.bulkIndexProducts.bind(productController));

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create and index a new product in Elasticsearch
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: "iPhone 15 Pro"
 *             description: "Latest iPhone with advanced camera system and A17 Pro chip"
 *             category: "Electronics"
 *             brand: "Apple"
 *             price: 999.99
 *             stock: 50
 *             rating: 4.8
 *             tags: ["smartphone", "camera", "5G", "premium"]
 *             images: ["iphone15pro1.jpg", "iphone15pro2.jpg"]
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get all products with pagination
 *     description: Retrieve all products with optional pagination and sorting
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Size'
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductList'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', productController.createProduct.bind(productController));
router.get('/', productController.getAllProducts.bind(productController));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a specific product by its unique identifier
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update product by ID
 *     description: Update an existing product's information
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: "iPhone 15 Pro Max"
 *             description: "Updated description with new features"
 *             price: 1099.99
 *             stock: 75
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete product by ID
 *     description: Remove a product from the Elasticsearch index
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Product deleted successfully'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', productController.getProductById.bind(productController));
router.put('/:id', productController.updateProduct.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));

module.exports = router;
