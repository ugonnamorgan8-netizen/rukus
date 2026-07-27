'use strict';

const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/**
 * POST /api/contact
 * Body: { name, email, message }
 * Saves the message to the DB and returns a confirmation.
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'name, email, and message are all required.' });
    }

    // Basic email format guard
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        email       TEXT NOT NULL,
        message     TEXT NOT NULL,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const { rows } = await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, submitted_at`,
      [name.trim(), email.trim().toLowerCase(), message.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Message received. We'll be in touch.",
      ref: rows[0].id,
      submitted_at: rows[0].submitted_at,
    });
  } catch (err) {
    console.error('[POST /api/contact]', err.message);
    res.status(500).json({ success: false, error: 'Could not save message.' });
  }
});

module.exports = router;
