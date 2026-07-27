'use strict';

/**
 * products-data.js
 * RUKUS Streetwear — Complete product catalog with Nigerian Naira pricing.
 * Used as fallback when API is unavailable (Vercel static / offline).
 */

const RUKUS_PRODUCTS = [

  // ── HOODIES ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'RUKUS EMBROIDERED HOODIE',
    price: 85000,
    category: 'hoodies',
    badge: 'NEW',
    description: 'Heavyweight premium cotton blend hoodie featuring high-density RUKUS graffiti embroidery across the chest. Built with double-lined hood and heavy ribbing. 380GSM French terry.',
    image_url: 'images/products/hoodie product15.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: 'RUKUS VOID WASHED PULLOVER',
    price: 92000,
    category: 'hoodies',
    badge: 'NEW',
    description: 'Garment-washed heavyweight RUKUS pullover with distressed raw hem and tonal back graphic. 380GSM French terry. Every piece carries a unique wash character.',
    image_url: 'images/products/combat product25.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    name: 'RUKUS ACID FLEECE HOODIE',
    price: 78000,
    category: 'hoodies',
    badge: 'HOT',
    description: 'Custom bleach-dyed RUKUS zip-up hoodie. Every piece is a one-of-one — no two are exactly alike. Kangaroo pocket with metal YKK zipper. 320GSM fleece.',
    image_url: 'images/products/combat product21.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 4,
    name: 'RUKUS SHADOW QUARTER-ZIP',
    price: 70000,
    category: 'hoodies',
    badge: 'NEW',
    description: 'Minimal ribbed RUKUS quarter-zip in matte black. Embossed rubber RUKUS patch on chest. Slim athletic cut, 300GSM combed cotton.',
    image_url: 'images/products/combat product22.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },

  // ── TEES ───────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'RUKUS MISFIT GRAPHIC TEE',
    price: 45000,
    category: 'tees',
    badge: 'NEW',
    description: 'Vintage wash oversized street tee with distressed RUKUS screen print on front and back. 240GSM luxury weight cotton with high collar fit. A misfit essential.',
    image_url: 'images/products/product-5.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 6,
    name: 'RUKUS CORE LOGO TEE',
    price: 38000,
    category: 'tees',
    badge: 'NEW',
    description: 'Clean heavy-cotton tee with puff-print RUKUS wordmark on chest. Boxy silhouette, drop shoulder, reinforced collar. The cleanest RUKUS essential.',
    image_url: 'images/products/polo product14.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 7,
    name: 'RUKUS NO RULES LONG SLEEVE',
    price: 52000,
    category: 'tees',
    badge: 'NEW',
    description: 'Oversized long sleeve with woven RUKUS "NO RULES" patch on sleeve and heavy back graphic. Double-needle stitched seams for lasting durability.',
    image_url: 'images/products/polo product18.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 8,
    name: 'RUKUS SIGNAL NOISE TEE',
    price: 42000,
    category: 'tees',
    badge: 'HOT',
    description: 'All-over RUKUS noise-pattern printed tee cut from 100% combed cotton. Subtle embroidered RUKUS chest logo. A statement without saying a word.',
    image_url: 'images/products/combat product19.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 9,
    name: 'RUKUS ACID-WASH OVERSIZED SHIRT',
    price: 60000,
    category: 'tees',
    badge: 'NEW',
    description: 'Heavy custom dye RUKUS button-down shirt. Raw hems, dropped shoulders, and embroidered RUKUS back graphic. Each piece holds a unique vintage tint.',
    image_url: 'images/products/product-9.png',
    sizes: ['S', 'M', 'L', 'XL']
  },

  // ── HEADWEAR ───────────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'RUKUS DREADLOCK BEANIE',
    price: 35000,
    category: 'headwear',
    badge: 'NEW',
    description: 'Dual-layered loose-fit knit RUKUS beanie with custom heavy distress detailing and stitched logo label on the cuff. One size with high stretch.',
    image_url: 'images/products/product-10.png',
    sizes: ['ONE SIZE']
  },
  {
    id: 11,
    name: 'RUKUS SNAPBACK',
    price: 40000,
    category: 'headwear',
    badge: 'NEW',
    description: 'Six-panel structured snapback in heavyweight twill. 3D embroidered RUKUS logo on front. Flat brim with green undervisor. Adjustable snap closure.',
    image_url: 'images/products/cap product12.jpg',
    sizes: ['ONE SIZE']
  },
  {
    id: 12,
    name: 'RUKUS MISFIT BUCKET HAT',
    price: 38000,
    category: 'headwear',
    badge: 'HOT',
    description: 'Reversible washed-canvas RUKUS bucket hat. One side plain, one side RUKUS allover logo print. Contrast stitching throughout.',
    image_url: 'images/products/cap product16.jpg',
    sizes: ['S/M', 'L/XL']
  },
  {
    id: 13,
    name: 'RUKUS NOISE BALACLAVA',
    price: 30000,
    category: 'headwear',
    badge: 'NEW',
    description: 'Knit stretch RUKUS balaclava with tonal wordmark print. Full face coverage. 100% acrylic yarn. The most disruptive RUKUS accessory.',
    image_url: 'images/products/Kids product11.jpg',
    sizes: ['ONE SIZE']
  },

  // ── FOOTWEAR ───────────────────────────────────────────────────────────────
  {
    id: 14,
    name: 'RUKUS SLIDE SANDAL',
    price: 55000,
    category: 'footwear',
    badge: 'NEW',
    description: 'Molded EVA sole with wide debossed RUKUS strap. Lightweight and grippy. Street-ready and pool-ready. The definitive RUKUS summer essential.',
    image_url: 'images/products/shoe product13.jpg',
    sizes: ['40', '41', '42', '43', '44', '45']
  },
  {
    id: 15,
    name: 'RUKUS MISFIT HIGH-TOP',
    price: 130000,
    category: 'footwear',
    badge: 'LIMITED',
    description: 'Co-designed RUKUS high-top in premium suede with contrast rubber sole. Woven RUKUS tongue tag and embossed heel counter. Strictly limited units.',
    image_url: 'images/products/shoe product17.jpg',
    sizes: ['40', '41', '42', '43', '44', '45']
  },
  {
    id: 16,
    name: 'RUKUS VOID LOW TRAINER',
    price: 110000,
    category: 'footwear',
    badge: 'NEW',
    description: 'Low-profile mesh and suede RUKUS trainer. Custom RUKUS insole, chunky rubber cupsole, tonal laces. Built for the streets.',
    image_url: 'images/products/shoe product24.jpg',
    sizes: ['40', '41', '42', '43', '44', '45']
  },
  {
    id: 17,
    name: 'RUKUS STREET BOOT',
    price: 145000,
    category: 'footwear',
    badge: 'HOT',
    description: 'Lace-up RUKUS utility boot with Vibram-style sole, speed hook lacing, and side-zip entry. Full grain leather upper. No compromises.',
    image_url: 'images/products/shoe product26.jpg',
    sizes: ['40', '41', '42', '43', '44', '45']
  },

  // ── OUTERWEAR & BOTTOMS ────────────────────────────────────────────────────
  {
    id: 18,
    name: 'RUKUS UTILITY VEST',
    price: 95000,
    category: 'outerwear',
    badge: 'HOT',
    description: 'RUKUS tactical vest tailored for layers. Tactical front webbing, buckle harness closure, hidden zipper utility pockets, and industrial hardware.',
    image_url: 'images/products/product-18.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 19,
    name: 'RUKUS CARGO PANTS',
    price: 110000,
    category: 'bottoms',
    badge: 'NEW',
    description: 'Relaxed fit RUKUS cargo trousers with modular strap adjustments, oversized 3D side pockets, and reinforced stitching at all stress points.',
    image_url: 'images/products/joggers product27.jpg',
    sizes: ['28', '30', '32', '34', '36']
  },
  {
    id: 20,
    name: 'RUKUS COACHES JACKET',
    price: 120000,
    category: 'outerwear',
    badge: 'LIMITED',
    description: 'Nylon RUKUS coaches jacket with contrast inner lining. Zip-up front, two side pockets with press-stud closure, embroidered RUKUS back logo.',
    image_url: 'images/products/jacket product20.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 21,
    name: 'RUKUS RAW EDGE DENIM JACKET',
    price: 135000,
    category: 'outerwear',
    badge: 'NEW',
    description: 'Heavyweight selvedge denim jacket with raw unfinished RUKUS hems. Custom distress, riveted pockets, woven RUKUS back patch. A collector piece.',
    image_url: 'images/products/jacket product23.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 22,
    name: 'RUKUS WOVEN LOGO BELT',
    price: 28000,
    category: 'accessories',
    badge: 'NEW',
    description: 'Nylon woven RUKUS belt with allover logo pattern and brushed gunmetal single-prong buckle. One size adjustable. Complete any RUKUS fit.',
    image_url: 'images/products/jacket ellow29.jpg',
    sizes: ['ONE SIZE']
  }
];

/* ── Export for both browser and Node.js environments ─────────────────────── */
if (typeof window !== 'undefined') {
  window.RUKUS_PRODUCTS = RUKUS_PRODUCTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RUKUS_PRODUCTS;
}
