'use strict';

/**
 * seed.js — Seeds 20+ RUKUS products into PostgreSQL.
 *
 * Usage:
 *   node server/seed.js
 *
 * Requires a valid .env with DB credentials.
 */

require('dotenv').config();
const pool = require('./db');

// ── Schema ─────────────────────────────────────────────────────────────────────
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    price       NUMERIC(10, 2) NOT NULL,
    category    TEXT NOT NULL,
    badge       TEXT DEFAULT 'NEW',
    description TEXT,
    image_url   TEXT,
    sizes       TEXT[]  DEFAULT ARRAY['S','M','L','XL'],
    in_stock    BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );
`;

// ── Product Data ───────────────────────────────────────────────────────────────
const products = [
  // ── HOODIES ─────────────────────────────────────────────────────────────────
  {
    name: 'RUKUS EMBROIDERED HOODIE',
    price: 85.00,
    category: 'hoodies',
    badge: 'NEW',
    description: 'Heavyweight premium cotton blend hoodie featuring detailed high-density RUKUS graffiti embroidery across the chest. Built with double-lined hood and heavy ribbing.',
    image_url: 'images/products/hoodie product15.jpg',
  },
  {
    name: 'VOID WASHED PULLOVER',
    price: 92.00,
    category: 'hoodies',
    badge: 'NEW',
    description: 'Garment-washed heavyweight pullover with distressed raw hem and tonal RUKUS back graphic. 380GSM French terry fabric.',
    image_url: 'images/products/combat product25.jpg',
  },
  {
    name: 'ACID FLEECE HOODIE',
    price: 78.00,
    category: 'hoodies',
    badge: 'HOT',
    description: 'Custom bleach-dyed zip-up hoodie. Every piece is a one-of-one — no two are exactly alike. Kangaroo pocket with metal YKK zipper.',
    image_url: 'images/products/combat product21.jpg',
  },
  {
    name: 'SHADOW QUARTER-ZIP',
    price: 70.00,
    category: 'hoodies',
    badge: 'NEW',
    description: 'Minimal ribbed quarter-zip in matte black. Embossed rubber RUKUS patch on chest. Slim athletic cut.',
    image_url: 'images/products/combat product22.jpg',
  },

  // ── TEES ────────────────────────────────────────────────────────────────────
  {
    name: 'MISFIT GRAPHIC TEE',
    price: 45.00,
    category: 'tees',
    badge: 'NEW',
    description: 'Vintage wash oversized street tee featuring distressed screen print graphics on front and back. 240GSM luxury weight cotton with high collar fit.',
    image_url: 'images/products/product-5.png',
  },
  {
    name: 'RUKUS CORE LOGO TEE',
    price: 38.00,
    category: 'tees',
    badge: 'NEW',
    description: 'Clean heavy-cotton tee with puff-print RUKUS wordmark on chest. Boxy silhouette, drop shoulder, reinforced collar.',
    image_url: 'images/products/polo product14.jpg',
  },
  {
    name: 'NO RULES LONG SLEEVE',
    price: 52.00,
    category: 'tees',
    badge: 'NEW',
    description: 'Oversized long sleeve with woven "NO RULES" patch on sleeve and back graphic. Double-needle stitched seams.',
    image_url: 'images/products/polo product18.jpg',
  },
  {
    name: 'SIGNAL NOISE TEE',
    price: 42.00,
    category: 'tees',
    badge: 'HOT',
    description: 'All-over noise-pattern printed tee cut from 100% combed cotton. Subtle RUKUS chest embroidery.',
    image_url: 'images/products/combat product19.jpg',
  },
  {
    name: 'ACID-WASH OVERSIZED SHIRT',
    price: 60.00,
    category: 'tees',
    badge: 'NEW',
    description: 'Heavy custom dye button-down shirt. Raw hems, dropped shoulders, and embroidered back graphic. Each piece holds a unique vintage tint.',
    image_url: 'images/products/product-9.png',
  },

  // ── HEADWEAR ────────────────────────────────────────────────────────────────
  {
    name: 'DREADLOCK BEANIE',
    price: 35.00,
    category: 'headwear',
    badge: 'NEW',
    description: 'Dual-layered loose-fit knit beanie with customized heavy distress detailing and a stitched logo label on the cuff. Standard sizing with high stretch.',
    image_url: 'images/products/product-10.png',
    sizes: ['ONE SIZE'],
  },
  {
    name: 'RUKUS SNAPBACK',
    price: 40.00,
    category: 'headwear',
    badge: 'NEW',
    description: 'Six-panel structured snapback in heavyweight twill. 3D embroidered RUKUS logo on front. Flat brim with green undervisor.',
    image_url: 'images/products/cap product12.jpg',
    sizes: ['ONE SIZE'],
  },
  {
    name: 'MISFIT BUCKET HAT',
    price: 38.00,
    category: 'headwear',
    badge: 'HOT',
    description: 'Reversible washed-canvas bucket hat. One side plain, one side RUKUS allover logo print. Contrast stitching.',
    image_url: 'images/products/cap product16.jpg',
    sizes: ['S/M', 'L/XL'],
  },
  {
    name: 'NOISE BALACLAVA',
    price: 30.00,
    category: 'headwear',
    badge: 'NEW',
    description: 'Knit stretch balaclava with tonal RUKUS wordmark. Full face coverage. 100% acrylic yarn.',
    image_url: 'images/products/Kids product11.jpg',
    sizes: ['ONE SIZE'],
  },

  // ── FOOTWEAR ────────────────────────────────────────────────────────────────
  {
    name: 'RUKUS SLIDE SANDAL',
    price: 55.00,
    category: 'footwear',
    badge: 'NEW',
    description: 'Molded EVA sole with a wide debossed RUKUS strap. Lightweight and grippy. Street-ready and pool-ready.',
    image_url: 'images/products/shoe product13.jpg',
    sizes: ['40', '41', '42', '43', '44', '45'],
  },
  {
    name: 'MISFIT HIGH-TOP SNEAKER',
    price: 130.00,
    category: 'footwear',
    badge: 'LIMITED',
    description: 'Co-designed high-top in premium suede with contrast rubber sole. Woven RUKUS tongue tag and embossed heel counter.',
    image_url: 'images/products/shoe product17.jpg',
    sizes: ['40', '41', '42', '43', '44', '45'],
  },
  {
    name: 'VOID LOW TRAINER',
    price: 110.00,
    category: 'footwear',
    badge: 'NEW',
    description: 'Low-profile mesh and suede trainer. Custom RUKUS insole, chunky rubber cupsole, tonal laces.',
    image_url: 'images/products/shoe product24.jpg',
    sizes: ['40', '41', '42', '43', '44', '45'],
  },
  {
    name: 'STREET BOOT HEAVY',
    price: 145.00,
    category: 'footwear',
    badge: 'HOT',
    description: 'Lace-up utility boot with Vibram-style sole, speed hook lacing, and side-zip entry. Full grain leather upper.',
    image_url: 'images/products/shoe product26.jpg',
    sizes: ['40', '41', '42', '43', '44', '45'],
  },

  // ── OUTERWEAR / OTHER ────────────────────────────────────────────────────────
  {
    name: 'MISFIT UTILITY VEST',
    price: 95.00,
    category: 'outerwear',
    badge: 'HOT',
    description: 'Technical vest tailored for layers. Includes tactical front webbing, buckle harness closure, hidden zipper utility pockets, and industrial hardware.',
    image_url: 'images/products/product-18.png',
  },
  {
    name: 'STREETWEAR CARGO PANTS',
    price: 110.00,
    category: 'bottoms',
    badge: 'NEW',
    description: 'Relaxed fit utility cargo trousers featuring modular strap adjustments, oversized 3D side pockets, and durable reinforced stitching at stress points.',
    image_url: 'images/products/joggers product27.jpg',
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    name: 'CHAOS COACHES JACKET',
    price: 120.00,
    category: 'outerwear',
    badge: 'LIMITED',
    description: 'Nylon coaches jacket with contrast inner lining. Zip-up front, two side pockets with press-stud closure, embroidered RUKUS back logo.',
    image_url: 'images/products/jacket product20.jpg',
  },
  {
    name: 'RAW EDGE DENIM JACKET',
    price: 135.00,
    category: 'outerwear',
    badge: 'NEW',
    description: 'Heavyweight selvedge denim jacket with raw unfinished hems. Custom distress, riveted pockets, woven back patch.',
    image_url: 'images/products/jacket product23.jpg',
  },
  {
    name: 'WOVEN LOGO BELT',
    price: 28.00,
    category: 'accessories',
    badge: 'NEW',
    description: 'Nylon woven belt with allover RUKUS logo pattern and brushed gunmetal single-prong buckle. One size adjustable.',
    image_url: 'images/products/jacket ellow29.jpg',
    sizes: ['ONE SIZE'],
  },
];

// ── Runner ─────────────────────────────────────────────────────────────────────
async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create table
    await client.query(CREATE_TABLE);
    console.log('[seed] ✓ products table ready');

    // Optionally wipe existing rows so re-seeding is idempotent
    await client.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
    console.log('[seed] ✓ existing products cleared');

    // Insert all products
    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, price, category, badge, description, image_url, sizes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          p.name,
          p.price,
          p.category,
          p.badge || 'NEW',
          p.description || '',
          p.image_url || '',
          p.sizes || ['S', 'M', 'L', 'XL'],
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`[seed] ✓ ${products.length} products seeded successfully`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[seed] ✗ Error — rolled back:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
