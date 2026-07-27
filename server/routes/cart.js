'use strict';

const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/**
 * POST /api/cart
 * Body: { session_id, product_id, size, quantity }
 * Upserts a cart item (increments quantity if same product+size already exists).
 */
router.post('/', async (req, res) => {
  try {
    const { session_id, product_id, size, quantity = 1 } = req.body;

    if (!session_id || !product_id || !size) {
      return res.status(400).json({ success: false, error: 'session_id, product_id, and size are required.' });
    }

    // Ensure the cart table exists (safe to call every time — idempotent)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id          SERIAL PRIMARY KEY,
        session_id  TEXT NOT NULL,
        product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
        size        TEXT NOT NULL,
        quantity    INTEGER NOT NULL DEFAULT 1,
        added_at    TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(session_id, product_id, size)
      )
    `);

    // Upsert: insert or increment quantity
    const { rows } = await pool.query(
      `INSERT INTO cart_items (session_id, product_id, size, quantity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (session_id, product_id, size)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [session_id, product_id, size, quantity]
    );

    res.status(201).json({ success: true, item: rows[0] });
  } catch (err) {
    console.error('[POST /api/cart]', err.message);
    res.status(500).json({ success: false, error: 'Could not update cart.' });
  }
});

/**
 * GET /api/cart/:session_id
 * Returns all cart items with product details for a given session.
 */
router.get('/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;

    const { rows } = await pool.query(
      `SELECT
         ci.id,
         ci.session_id,
         ci.size,
         ci.quantity,
         ci.added_at,
         p.id         AS product_id,
         p.name,
         p.price,
         p.image_url,
         p.category
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.session_id = $1
       ORDER BY ci.added_at ASC`,
      [session_id]
    );

    const subtotal = rows.reduce((sum, row) => sum + parseFloat(row.price) * row.quantity, 0);

    res.json({ success: true, items: rows, subtotal: subtotal.toFixed(2) });
  } catch (err) {
    console.error('[GET /api/cart/:session_id]', err.message);
    res.status(500).json({ success: false, error: 'Could not fetch cart.' });
  }
});

/**
 * DELETE /api/cart/:id
 * Removes a single cart item by its row ID.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cart_items WHERE id = $1', [id]);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    console.error('[DELETE /api/cart/:id]', err.message);
    res.status(500).json({ success: false, error: 'Could not remove item.' });
  }
});

module.exports = router;
