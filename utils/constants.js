
const STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};


const MESSAGES = {
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_REQUEST: "Invalid request data.",
  PRODUCT_FETCH_SUCCESS: "Products fetched successfully.",
  PRODUCT_NOT_FOUND: "No products found.",
  CATEGORY_NOT_FOUND: "Category not found.",
  FILTER_SUCCESS: "Filter applied successfully.",
  FILTER_FAILED: "Failed to apply filters."
};

module.exports = { STATUS, MESSAGES };
