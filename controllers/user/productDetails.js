const { createStructParentTreeNextKey } = require("pdfkit");
const Product = require("../../models/productSchema");

const AppError = require('../../utils/appError')

const {STATUS,MESSAGES}=require('../../utils/constants')

const loadDetails = async (req, res,next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).lean();
    console.log(product)
    if (!product ||product.isDeleted ) {
      throw new AppError(MESSAGES.PRODUCT_UNAVAILABLE, STATUS.NOT_FOUND);
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean();

    res.render("user/productDetailPage", {
      user: req.session.user,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.log("loadDetails:",error)
    next(new AppError(MESSAGES.SERVER_ERROR,STATUS.SERVER_ERROR))
  }
};

module.exports = {
  loadDetails,
};
