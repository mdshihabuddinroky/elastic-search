# Elasticsearch E-commerce API

A simple and powerful Node.js backend for e-commerce using Elasticsearch for fast search.

## ✨ What This Does

- **Fast Search**: Find products quickly with Elasticsearch
- **Smart Matching**: Handles typos and partial searches
- **Easy API**: Simple REST endpoints to manage products

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Elasticsearch
```bash
# Using Docker (recommended)
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

### 3. Start the Server
```bash
npm run dev
```

Your API will be running at `http://localhost:3000`

## 📚 API Documentation

Open your browser and go to: **http://localhost:3000/api-docs**

This gives you a live interface to test all your API endpoints!

## 🔍 Main Features

### Product Management
- **Create** new products
- **Read** product details
- **Update** product information
- **Delete** products
- **List** all products with pagination

### Smart Search
- **Text Search**: Find products by name, description, or tags
- **Filters**: Filter by category, brand, price, rating, stock
- **Fuzzy Search**: Handles typos automatically
- **Fast Results**: Returns results in milliseconds

### Example Searches
```bash
# Find phones
GET /api/products/search?q=phone

# Find expensive electronics
GET /api/products/search?q=electronics&minPrice=1000

# Find Apple products with high rating
GET /api/products/search?q=apple&minRating=4.5

# Find products with typos (Elasticsearch magic!)
GET /api/products/search?q=iphne
```

## 📁 Project Structure

```
src/
├── config/          # Elasticsearch connection
├── controllers/     # Handle HTTP requests
├── models/          # Product data structure
├── routes/          # API endpoints
├── services/        # Business logic
└── server.js        # Main app file
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check if server is running |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get one product |
| `POST` | `/api/products` | Create new product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/products/search` | Search products |
| `POST` | `/api/products/bulk` | Add many products at once |

## 🔧 Environment Variables

Create a `.env` file with:

```bash
PORT=3000
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

## 💡 Why Elasticsearch?

| Traditional Database | Elasticsearch |
|---------------------|---------------|
| ❌ Slow text search | ✅ Fast full-text search |
| ❌ No typo handling | ✅ Handles typos automatically |
| ❌ Complex queries | ✅ Simple, powerful queries |
| ❌ No relevance scoring | ✅ Smart result ranking |

## 🎯 Use Cases

- **E-commerce websites** with large product catalogs
- **Search-heavy applications** that need fast results
- **Product discovery** with smart filterings


---

**Happy coding! 🎉**

This API gives you enterprise-level search power with simple setup.
