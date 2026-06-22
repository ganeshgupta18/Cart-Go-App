const mongoose = require('mongoose');
const { createProduct } = require('../backend/controllers/productController');
const Product = require('../backend/models/Product');
require('dotenv').config({ path: '../backend/.env' });

async function runTest() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);

  // Set credentials to something that is NOT 'dummy' so it attempts upload
  process.env.CLOUDINARY_CLOUD_NAME = 'real_but_invalid_cloud';
  process.env.CLOUDINARY_API_KEY = '123456';
  process.env.CLOUDINARY_API_SECRET = 'abcde';

  // Mock req and res objects
  const req = {
    body: {
      name: 'Test Controller Product',
      description: 'Verifying try-catch Cloudinary fallback',
      price: '199',
      category: 'Electronics',
      stock: '10',
      discount: '15'
    },
    file: {
      path: 'scratch/dummy_path.png'
    }
  };

  const res = {
    statusCode: 200,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log('\n--- Controller Response ---');
      console.log('Status Code:', this.statusCode);
      console.log('Data:', data);
    }
  };

  console.log('\nRunning createProduct controller with invalid Cloudinary credentials...');
  try {
    await createProduct(req, res);
  } catch (err) {
    console.error('Controller execution threw an unhandled error:', err);
  } finally {
    // Clean up test product
    await Product.deleteMany({ name: 'Test Controller Product' });
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

runTest();
