const { Client } = require('@elastic/elasticsearch');

// Elasticsearch client configuration
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Index configuration for products
const PRODUCTS_INDEX = 'products';

// Product mapping schema
const productMapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      name: { 
        type: 'text',
        analyzer: 'english',
        fields: {
          keyword: { type: 'keyword' }
        }
      },
      description: { 
        type: 'text',
        analyzer: 'english'
      },
      category: { 
        type: 'keyword',
        fields: {
          text: { type: 'text', analyzer: 'english' }
        }
      },
      brand: { 
        type: 'keyword',
        fields: {
          text: { type: 'text', analyzer: 'english' }
        }
      },
      price: { type: 'float' },
      stock: { type: 'integer' },
      rating: { type: 'float' },
      tags: { type: 'keyword' },
      images: { type: 'keyword' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' }
    }
  },
  settings: {
    analysis: {
      analyzer: {
        english: {
          type: 'standard',
          stopwords: '_english_'
        }
      }
    }
  }
};

// Initialize index if it doesn't exist
async function initializeIndex() {
  try {
    const indexExists = await client.indices.exists({
      index: PRODUCTS_INDEX
    });

    if (!indexExists) {
      await client.indices.create({
        index: PRODUCTS_INDEX,
        body: productMapping
      });
      console.log(`✅ Index '${PRODUCTS_INDEX}' created successfully`);
    } else {
      console.log(`📋 Index '${PRODUCTS_INDEX}' already exists`);
    }
  } catch (error) {
    console.error('❌ Error initializing index:', error.message);
    throw error;
  }
}

// Test connection
async function testConnection() {
  try {
    const info = await client.info();
    console.log('✅ Elasticsearch connection successful');
    console.log(`📊 Cluster: ${info.cluster_name}, Version: ${info.version.number}`);
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
    return false;
  }
}

module.exports = {
  client,
  PRODUCTS_INDEX,
  initializeIndex,
  testConnection
};
