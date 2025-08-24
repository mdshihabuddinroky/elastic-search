# 🚀 Quick Start Guide

Get your Elasticsearch e-commerce backend running in minutes!

## Prerequisites ✅
- Node.js v18+ (you have v22.14.0 ✅)
- Docker (for Elasticsearch) or Elasticsearch installed locally

## 1. Install Dependencies
```bash
npm install
```

## 2. Start Elasticsearch

### Option A: Docker (Recommended)
```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

### Option B: Local Installation
- Download from [Elasticsearch Downloads](https://www.elastic.co/downloads/elasticsearch)
- Start the service

## 3. Test Setup
```bash
npm run test-setup
```

## 4. Start the Server
```bash
npm run dev
```

## 5. Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product for development",
    "category": "Test",
    "brand": "TestBrand",
    "price": 99.99,
    "stock": 10,
    "rating": 4.5,
    "tags": ["test", "development"],
    "images": ["test1.jpg"]
  }'
```

### Search Products
```bash
curl "http://localhost:3000/api/products/search?q=test&page=1&size=10"
```

## 6. Import Postman Collection
1. Open Postman
2. Import `Elasticsearch-Ecommerce-API.postman_collection.json`
3. Test all endpoints with the pre-configured requests

## 7. Load Sample Data
Use the "Load Sample Data" request in Postman or:
```bash
curl -X POST http://localhost:3000/api/products/bulk \
  -H "Content-Type: application/json" \
  -d @sample-data.json
```

## 🎯 What's Next?
- Explore the API endpoints
- Test search functionality
- Build your Flutter frontend
- Add authentication
- Implement rate limiting

## 🆘 Need Help?
- Check the main README.md for detailed documentation
- Verify Elasticsearch is running: `curl http://localhost:9200`
- Check server logs for error messages
- Ensure your .env file is configured correctly

Happy coding! 🎉
