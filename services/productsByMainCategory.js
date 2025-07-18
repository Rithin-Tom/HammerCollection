const Product = require('../models/productSchema');
const Category = require('../models/categorySchema');

async function getProductsByMainCategory(parentName, limit ) {
  const parent = await Category.findOne({ name: parentName, parent: null });
  if (!parent) return [];

  const subs = await Category.find({ parent: parent._id }).select('_id');
  const allCategoryIds = subs.map(c => c._id).concat(parent._id);

  return await Product.find({
    category: { $in: allCategoryIds },
    isDeleted: false
  }).limit(limit).lean();
}

module.exports = getProductsByMainCategory;

