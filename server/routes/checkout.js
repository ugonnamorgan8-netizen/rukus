'use strict';

const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/**
 * POST /api/checkout
 * Body: { customer, cart_items, total_amount, payment_method }
 * Creates order and clears session cart items.
 */
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { customer, cart_items, total_amount, payment_method = 'card', session_id } = req.body;

    if (!customer || !customer.email || !customer.first_name || !customer.last_name || !cart_items || cart_items.length === 0) {
      return res.status(400).json({ success: false, error: 'Complete customer details and cart items are required.' });
    }

    await client.query('BEGIN');

    // Create orders table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id            SERIAL PRIMARY KEY,
        order_number  TEXT NOT NULL UNIQUE,
        email         TEXT NOT NULL,
        first_name    TEXT NOT NULL,
        last_name     TEXT NOT NULL,
        address       TEXT NOT NULL,
        city          TEXT NOT NULL,
        postal_code   TEXT,
        country       TEXT NOT NULL DEFAULT 'Nigeria',
        phone         TEXT,
        total_amount  NUMERIC(10, 2) NOT NULL,
        payment_method TEXT DEFAULT 'card',
        status        TEXT DEFAULT 'PENDING',
        items         JSONB NOT NULL,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const orderNumber = 'RKS-' + Math.floor(100000 + Math.random() * 900000);

    const { rows } = await client.query(
      `INSERT INTO orders (order_number, email, first_name, last_name, address, city, postal_code, country, phone, total_amount, payment_method, items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        orderNumber,
        customer.email,
        customer.first_name,
        customer.last_name,
        customer.address,
        customer.city,
        customer.postal_code || '',
        customer.country || 'Nigeria',
        customer.phone || '',
        total_amount,
        payment_method,
        JSON.stringify(cart_items)
      ]
    );

    if (session_id) {
      await client.query('DELETE FROM cart_items WHERE session_id = $1', [session_id]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[POST /api/checkout]', err.stack || err.message);
    res.status(500).json({ success: false, error: 'Failed to process order.' });
  } finally {
    client.release();
  }
});

module.exports = router;
