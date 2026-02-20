const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import models to register associations
require('./models/index');
const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files using absolute path

// Global Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', brand: 'ELVARA & CO.' }));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
    console.log('✅ Database connected and synced');

    // Manual fallback for SQLite issues
    try {
        await sequelize.query("ALTER TABLE Products ADD COLUMN sizes TEXT DEFAULT '[]'");
    } catch (e) { }

    try {
        await sequelize.query("ALTER TABLE Products ADD COLUMN image TEXT");
    } catch (e) { }

    app.listen(PORT, () => {
        console.log(`🚀 ELVARA & CO. Backend running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Database connection failed:', err);
});
