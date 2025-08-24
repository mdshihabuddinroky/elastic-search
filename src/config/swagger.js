const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Elasticsearch E-commerce API',
      version: '1.0.0',
      description: 'A comprehensive Node.js backend API for e-commerce using Elasticsearch for advanced search capabilities',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'description', 'category', 'brand', 'price', 'stock'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique product identifier',
              example: 'prod_1703123456789_abc123def'
            },
            name: {
              type: 'string',
              description: 'Product name',
              minLength: 2,
              example: 'iPhone 15 Pro'
            },
            description: {
              type: 'string',
              description: 'Product description',
              minLength: 10,
              example: 'Latest iPhone with advanced camera system and A17 Pro chip'
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'Electronics'
            },
            brand: {
              type: 'string',
              description: 'Product brand',
              example: 'Apple'
            },
            price: {
              type: 'number',
              description: 'Product price',
              minimum: 0,
              example: 999.99
            },
            stock: {
              type: 'integer',
              description: 'Available stock quantity',
              minimum: 0,
              example: 50
            },
            rating: {
              type: 'number',
              description: 'Product rating (0-5)',
              minimum: 0,
              maximum: 5,
              example: 4.8
            },
            tags: {
              type: 'array',
              description: 'Product tags for search',
              items: {
                type: 'string'
              },
              example: ['smartphone', 'camera', '5G', 'premium']
            },
            images: {
              type: 'array',
              description: 'Product image URLs',
              items: {
                type: 'string'
              },
              example: ['iphone15pro1.jpg', 'iphone15pro2.jpg']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product creation timestamp',
              example: '2023-12-21T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product last update timestamp',
              example: '2023-12-21T10:30:00.000Z'
            }
          }
        },
        ProductResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            product: {
              $ref: '#/components/schemas/Product'
            },
            elasticsearchResponse: {
              type: 'object',
              description: 'Elasticsearch indexing response'
            }
          }
        },
        ProductList: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              }
            },
            total: {
              type: 'integer',
              description: 'Total number of products',
              example: 150
            },
            page: {
              type: 'integer',
              description: 'Current page number',
              example: 1
            },
            size: {
              type: 'integer',
              description: 'Items per page',
              example: 10
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
              example: 15
            }
          }
        },
        SearchResponse: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              }
            },
            total: {
              type: 'integer',
              example: 25
            },
            page: {
              type: 'integer',
              example: 1
            },
            size: {
              type: 'integer',
              example: 10
            },
            totalPages: {
              type: 'integer',
              example: 3
            },
            aggregations: {
              type: 'object',
              properties: {
                categories: {
                  type: 'object',
                  description: 'Category aggregations'
                },
                brands: {
                  type: 'object',
                  description: 'Brand aggregations'
                },
                price_ranges: {
                  type: 'object',
                  description: 'Price range aggregations'
                }
              }
            }
          }
        },
        BulkProductRequest: {
          type: 'object',
          required: ['products'],
          properties: {
            products: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              },
              minItems: 1,
              maxItems: 1000
            }
          }
        },
        BulkProductResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            indexed: {
              type: 'integer',
              description: 'Number of successfully indexed products',
              example: 50
            },
            failed: {
              type: 'integer',
              description: 'Number of failed products',
              example: 0
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Error messages for failed products'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed'
            },
            message: {
              type: 'string',
              example: 'Product name must be at least 2 characters long'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK'
            },
            message: {
              type: 'string',
              example: 'API is running'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-12-21T10:30:00.000Z'
            }
          }
        },
        IndexStats: {
          type: 'object',
          properties: {
            indexName: {
              type: 'string',
              example: 'products'
            },
            documentCount: {
              type: 'integer',
              example: 150
            },
            storageSize: {
              type: 'string',
              example: '2.5MB'
            },
            health: {
              type: 'string',
              example: 'green'
            }
          }
        }
      },
      parameters: {
        ProductId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Product unique identifier',
          schema: {
            type: 'string'
          },
          example: 'prod_1703123456789_abc123def'
        },
        Page: {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          example: 1
        },
        Size: {
          name: 'size',
          in: 'query',
          required: false,
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          },
          example: 10
        },
        SearchQuery: {
          name: 'q',
          in: 'query',
          required: false,
          description: 'Search query for text search',
          schema: {
            type: 'string'
          },
          example: 'iphone'
        },
        Category: {
          name: 'category',
          in: 'query',
          required: false,
          description: 'Filter by product category',
          schema: {
            type: 'string'
          },
          example: 'Electronics'
        },
        Brand: {
          name: 'brand',
          in: 'query',
          required: false,
          description: 'Filter by product brand',
          schema: {
            type: 'string'
          },
          example: 'Apple'
        },
        MinPrice: {
          name: 'minPrice',
          in: 'query',
          required: false,
          description: 'Minimum price filter',
          schema: {
            type: 'number',
            minimum: 0
          },
          example: 500
        },
        MaxPrice: {
          name: 'maxPrice',
          in: 'query',
          required: false,
          description: 'Maximum price filter',
          schema: {
            type: 'number',
            minimum: 0
          },
          example: 1000
        },
        MinRating: {
          name: 'minRating',
          in: 'query',
          required: false,
          description: 'Minimum rating filter',
          schema: {
            type: 'number',
            minimum: 0,
            maximum: 5
          },
          example: 4.0
        },
        InStock: {
          name: 'inStock',
          in: 'query',
          required: false,
          description: 'Filter by stock availability',
          schema: {
            type: 'boolean'
          },
          example: true
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
