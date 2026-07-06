const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL
].filter(Boolean).map(origin => origin.replace(/\/$/, ''));

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const normalizedOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.includes(normalizedOrigin)) return true;

  try {
    return new URL(normalizedOrigin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

// CORS Configuration
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CartGo API is running',
    mongoConfigured: Boolean(process.env.MONGO_URI),
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

app.get(['/favicon.ico', '/favicon.png'], (req, res) => {
  res.status(204).end();
});

// Database connection middleware (lazy connection)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure environment variables are configured correctly.',
      error: error.message
    });
  }
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/promos', require('./routes/promoRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Test Route
app.get('/', (req, res) => {
res.send('CartGo API is running...');
});

// Export for Vercel
module.exports = app;

// Start server locally if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
