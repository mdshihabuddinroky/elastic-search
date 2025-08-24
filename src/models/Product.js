class Product {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.brand = data.brand;
    this.price = parseFloat(data.price);
    this.stock = parseInt(data.stock);
    this.rating = parseFloat(data.rating) || 0.0;
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.images = Array.isArray(data.images) ? data.images : [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Product name must be at least 2 characters long');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('Product description must be at least 10 characters long');
    }

    if (!this.category || this.category.trim().length === 0) {
      errors.push('Product category is required');
    }

    if (!this.brand || this.brand.trim().length === 0) {
      errors.push('Product brand is required');
    }

    if (isNaN(this.price) || this.price <= 0) {
      errors.push('Product price must be a positive number');
    }

    if (isNaN(this.stock) || this.stock < 0) {
      errors.push('Product stock must be a non-negative number');
    }

    if (this.rating < 0 || this.rating > 5) {
      errors.push('Product rating must be between 0 and 5');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toElasticsearchDoc() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      brand: this.brand,
      price: this.price,
      stock: this.stock,
      rating: this.rating,
      tags: this.tags,
      images: this.images,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromElasticsearchDoc(doc) {
    return new Product({
      id: doc._id || doc.id,
      name: doc._source?.name || doc.name,
      description: doc._source?.description || doc.description,
      category: doc._source?.category || doc.category,
      brand: doc._source?.brand || doc.brand,
      price: doc._source?.price || doc.price,
      stock: doc._source?.stock || doc.stock,
      rating: doc._source?.rating || doc.rating,
      tags: doc._source?.tags || doc.tags || [],
      images: doc._source?.images || doc.images || [],
      createdAt: doc._source?.createdAt || doc.createdAt,
      updatedAt: doc._source?.updatedAt || doc.updatedAt
    });
  }
}

module.exports = Product;
