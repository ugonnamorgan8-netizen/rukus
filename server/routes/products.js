'use strict';

const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/**
 * GET /api/products
 * Returns all products ordered by newest first.
 * Optional query: ?category=HOODIES or ?collection=new_collection
 */
router.get('/', async (req, res) => {
  try {
    const { category, collection } = req.query;

    let query = 'SELECT * FROM products';
    const conditions = [];
    const params = [];

    if (category && category.toLowerCase() !== 'all') {
      params.push(category.toLowerCase());
      conditions.push(`LOWER(category) = $${params.length}`);
    }

    if (collection) {
      params.push(collection.toLowerCase());
      conditions.push(`LOWER(badge) = $${params.length} OR LOWER(category) = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, products: rows, collection: collection || 'all' });
  } catch (err) {
    console.error('[GET /api/products] Error:', err.stack || err.message);
    res.status(500).json({ success: false, error: 'Could not fetch products.' });
  }
});

/**
 * GET /api/products/:id
 * Returns a single product by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.json({ success: true, product: rows[0] });
  } catch (err) {
    console.error('[GET /api/products/:id]', err.message);
    res.status(500).json({ success: false, error: 'Could not fetch product.' });
  }
});

module.exports = router;
