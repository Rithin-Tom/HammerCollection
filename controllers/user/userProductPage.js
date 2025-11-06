const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const Wishlist = require('../../models/wishlistSchema')
const getProductsByMainCategory = require("../../services/productsByMainCategory");

const AppError = require("../../utils/appError");
const { STATUS, MESSAGES } = require("../../utils/constants");

const loadShopPage = async (req, res,next) => {
  try {
    const search = req.query.q || "";
    const mainCategories = await Category.find({
      parent: null,
      isDeleted: false,
    }).lean();

    const categoryTree = await Promise.all(
      mainCategories.map(async (main) => {
        const subcategories = await Category.find({
          parent: main._id,
          isDeleted: false,
        }).lean();
        return {
          _id: main._id,
          name: main.name,
          slug: main.slug,
          children: subcategories,
        };
      })
    );

    res.status(STATUS.SUCCESS).render("user/shoppingPage", { categories: categoryTree ,search});
  } catch (error) {
    console.log("loadShopPage:",error)
    if (error instanceof AppError) {
      return next(error);
    }

    
    next(new AppError(MESSAGES.SERVER_ERROR, STATUS.SERVER_ERROR));
  }
};

const filterProducts = async (req, res) => {
  try {
    const {
      categoryIds,
      minPrice,
      maxPrice,
      rating,
      page = 1,
      limit = 8,
      search = ""
    } = req.body;

    let products = [];
    let subCategoryIds = [];

     let wishlistIds = [];
    if (req.session?.user?._id) {
      const wishlist = await Wishlist.findOne(
        { userId: req.session.user._id },
        "products.productId"
      ).lean();

      if (wishlist && wishlist.products) {
        wishlistIds = wishlist.products.map(p => p.productId.toString());
      }
    }

    if (categoryIds && categoryIds.length > 0) {
      const selectedCategories = await Category.find({
        _id: { $in: categoryIds },
      }).lean();

      for (const category of selectedCategories) {
        if (!category.parent) {
          const mainProducts = await getProductsByMainCategory(category.name);
          products.push(...mainProducts);
        } else {
          subCategoryIds.push(category._id);
        }
      }

      if (subCategoryIds.length > 0) {
        const subProducts = await Product.find({
          category: { $in: subCategoryIds },
          isDeleted: false,
          isActive: true,
        })
          .populate("category")
          .lean();

        products.push(...subProducts);
      }
    } else {
      products = await Product.find({
        isDeleted: false,
        isActive: true,
      })
        .populate("category")
        .lean();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      products = products.filter((product) => {
        const price = product.salePrice;
        if (minPrice && maxPrice) return price >= minPrice && price <= maxPrice;
        if (minPrice) return price >= minPrice;
        if (maxPrice) return price <= maxPrice;
        return true;
      });
    }

    if (rating !== undefined) {
      products = products.filter((product) => product.rating >= rating);


    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      products = products.filter(
        (product) =>
          regex.test(product.name) ||
          regex.test(product.description) ||
          (product.category && regex.test(product.category.name))
      );
    }

     products = products.map(p => ({...p,isWishlist: wishlistIds.includes(p._id.toString())}));
    const totalProducts = products.length;
    const start = (page - 1) * limit;
    const paginatedProducts = products.slice(start, start + limit);



    res.status(STATUS.SUCCESS).json({
      success: true,
      products: paginatedProducts,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(STATUS.SERVER_ERROR).json({ success: false, message: MESSAGES.SERVER_ERROR });
  }
};

module.exports = {
  loadShopPage,
  filterProducts,
};
