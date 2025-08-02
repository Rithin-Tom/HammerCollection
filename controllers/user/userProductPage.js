const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const getProductsByMainCategory = require("../../services/productsByMainCategory");

const loadShopPage = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate(
      "category"
    );

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

    res.render("user/shoppingPage", { categories: categoryTree });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
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
    } = req.body;

    let products = [];
    let subCategoryIds = [];

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
    const totalProducts = products.length;
    const start = (page - 1) * limit;
    const paginatedProducts = products.slice(start, start + limit);

    res.json({
      success: true,
      products: paginatedProducts,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  loadShopPage,
  filterProducts,
};
