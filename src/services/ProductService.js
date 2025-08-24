const { client, PRODUCTS_INDEX } = require('../config/elasticsearch');
const Product = require('../models/Product');

class ProductService {
  // Create/Index a new product
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      const validation = product.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const doc = product.toElasticsearchDoc();
      
      const response = await client.index({
        index: PRODUCTS_INDEX,
        id: product.id,
        body: doc
      });

      console.log(`✅ Product indexed successfully: ${product.id}`);
      return {
        success: true,
        product: product,
        elasticsearchResponse: response
      };
    } catch (error) {
      console.error('❌ Error creating product:', error.message);
      throw error;
    }
  }

  // Get a product by ID
  async getProductById(productId) {
    try {
      const response = await client.get({
        index: PRODUCTS_INDEX,
        id: productId
      });

      const product = Product.fromElasticsearchDoc(response);
      return product;
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        throw new Error('Product not found');
      }
      console.error('❌ Error getting product:', error.message);
      throw error;
    }
  }

  // Get all products with pagination
  async getAllProducts(page = 1, size = 10) {
    try {
      const from = (page - 1) * size;
      
      const response = await client.search({
        index: PRODUCTS_INDEX,
        body: {
          query: {
            match_all: {}
          },
          sort: [
            { createdAt: { order: 'desc' } }
          ],
          from: from,
          size: size
        }
      });

      const products = response.hits.hits.map(hit => 
        Product.fromElasticsearchDoc(hit)
      );

      return {
        products,
        total: response.hits.total.value,
        page,
        size,
        totalPages: Math.ceil(response.hits.total.value / size)
      };
    } catch (error) {
      console.error('❌ Error getting all products:', error.message);
      throw error;
    }
  }

  // Search products
  async searchProducts(query, filters = {}, page = 1, size = 10) {
    try {
      const from = (page - 1) * size;
      
      // Build search query
      let searchQuery = {
        bool: {
          must: [],
          filter: []
        }
      };

      // Text search across name, description, category, and brand
      if (query && query.trim()) {
        searchQuery.bool.must.push({
          multi_match: {
            query: query,
            fields: ['name^3', 'description^2', 'category.text', 'brand.text'],
            type: 'best_fields',
            fuzziness: 'AUTO'
          }
        });
      }

      // Apply filters
      if (filters.category) {
        searchQuery.bool.filter.push({
          term: { category: filters.category }
        });
      }

      if (filters.brand) {
        searchQuery.bool.filter.push({
          term: { brand: filters.brand }
        });
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const priceFilter = { range: { price: {} } };
        if (filters.minPrice !== undefined) priceFilter.range.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) priceFilter.range.price.lte = filters.maxPrice;
        searchQuery.bool.filter.push(priceFilter);
      }

      if (filters.minRating !== undefined) {
        searchQuery.bool.filter.push({
          range: { rating: { gte: filters.minRating } }
        });
      }

      if (filters.inStock !== undefined) {
        if (filters.inStock) {
          searchQuery.bool.filter.push({
            range: { stock: { gt: 0 } }
          });
        }
      }

      // If no query, use match_all
      if (searchQuery.bool.must.length === 0 && searchQuery.bool.filter.length === 0) {
        searchQuery = { match_all: {} };
      }

      const response = await client.search({
        index: PRODUCTS_INDEX,
        body: {
          query: searchQuery,
          sort: [
            { _score: { order: 'desc' } },
            { createdAt: { order: 'desc' } }
          ],
          from: from,
          size: size,
          aggs: {
            categories: {
              terms: { field: 'category' }
            },
            brands: {
              terms: { field: 'brand' }
            },
            price_ranges: {
              range: {
                field: 'price',
                ranges: [
                  { from: 0, to: 50 },
                  { from: 50, to: 100 },
                  { from: 100, to: 200 },
                  { from: 200 }
                ]
              }
            }
          }
        }
      });

      const products = response.hits.hits.map(hit => 
        Product.fromElasticsearchDoc(hit)
      );

      return {
        products,
        total: response.hits.total.value,
        page,
        size,
        totalPages: Math.ceil(response.hits.total.value / size),
        aggregations: response.aggregations
      };
    } catch (error) {
      console.error('❌ Error searching products:', error.message);
      throw error;
    }
  }

  // Update a product
  async updateProduct(productId, updateData) {
    try {
      // First get the existing product
      const existingProduct = await this.getProductById(productId);
      
      // Merge with update data
      const updatedProduct = new Product({
        ...existingProduct,
        ...updateData,
        id: productId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      });

      const validation = updatedProduct.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const doc = updatedProduct.toElasticsearchDoc();
      
      const response = await client.update({
        index: PRODUCTS_INDEX,
        id: productId,
        body: {
          doc: doc
        }
      });

      console.log(`✅ Product updated successfully: ${productId}`);
      return {
        success: true,
        product: updatedProduct,
        elasticsearchResponse: response
      };
    } catch (error) {
      console.error('❌ Error updating product:', error.message);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(productId) {
    try {
      const response = await client.delete({
        index: PRODUCTS_INDEX,
        id: productId
      });

      console.log(`✅ Product deleted successfully: ${productId}`);
      return {
        success: true,
        elasticsearchResponse: response
      };
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        throw new Error('Product not found');
      }
      console.error('❌ Error deleting product:', error.message);
      throw error;
    }
  }

  // Delete the entire index
  async deleteIndex() {
    try {
      const response = await client.indices.delete({
        index: PRODUCTS_INDEX
      });

      console.log(`✅ Index '${PRODUCTS_INDEX}' deleted successfully`);
      return {
        success: true,
        elasticsearchResponse: response
      };
    } catch (error) {
      console.error('❌ Error deleting index:', error.message);
      throw error;
    }
  }

  // Get index statistics
  async getIndexStats() {
    try {
      const response = await client.indices.stats({
        index: PRODUCTS_INDEX
      });

      return {
        indexName: PRODUCTS_INDEX,
        documentCount: response.indices[PRODUCTS_INDEX]?.total?.docs?.count || 0,
        storageSize: response.indices[PRODUCTS_INDEX]?.total?.store?.size_in_bytes || 0,
        stats: response.indices[PRODUCTS_INDEX]
      };
    } catch (error) {
      console.error('❌ Error getting index stats:', error.message);
      throw error;
    }
  }

  // Bulk index products
  async bulkIndexProducts(products) {
    try {
      const operations = [];
      
      products.forEach(product => {
        const productObj = new Product(product);
        const validation = productObj.validate();
        
        if (!validation.isValid) {
          throw new Error(`Validation failed for product ${productObj.id}: ${validation.errors.join(', ')}`);
        }

        operations.push(
          { index: { _index: PRODUCTS_INDEX, _id: productObj.id } },
          productObj.toElasticsearchDoc()
        );
      });

      const response = await client.bulk({
        body: operations
      });

      if (response.errors) {
        const errors = response.items
          .filter(item => item.index?.error)
          .map(item => ({
            id: item.index._id,
            error: item.index.error.reason
          }));
        
        throw new Error(`Bulk indexing errors: ${JSON.stringify(errors)}`);
      }

      console.log(`✅ Bulk indexed ${products.length} products successfully`);
      return {
        success: true,
        count: products.length,
        elasticsearchResponse: response
      };
    } catch (error) {
      console.error('❌ Error bulk indexing products:', error.message);
      throw error;
    }
  }
}

module.exports = ProductService;
