'use strict';

const RUKUS_PRODUCTS = require('../js/products-data');

module.exports = (req, res) => {
  try {
    const { category, collection, id } = req.query || {};

    if (id) {
      const product = RUKUS_PRODUCTS.find(p => String(p.id) === String(id));
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found.' });
      }
      return res.status(200).json({ success: true, product });
    }

    let filtered = [...RUKUS_PRODUCTS];

    if (category && category.toLowerCase() !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (collection) {
      const col = collection.toLowerCase();
      filtered = filtered.filter(p => 
        (p.badge && p.badge.toLowerCase() === col) || 
        (p.category && p.category.toLowerCase() === col)
      );
    }

    return res.status(200).json({
      success: true,
      products: filtered,
      collection: collection || 'all'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
