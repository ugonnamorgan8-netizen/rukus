'use strict';

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config();

// Route modules
const productsRouter = require('./routes/products');
const cartRouter     = require('./routes/cart');
const contactRouter  = require('./routes/contact');
const checkoutRouter = require('./routes/checkout');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend from the project root
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/cart',     cartRouter);
app.use('/api/contact',  contactRouter);
app.use('/api/checkout', checkoutRouter);

// ── Catch-all: send index.html for any non-API path ───────────────────────────
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err.stack || err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[RUKUS] Server running → http://localhost:${PORT}`);
});
