const { STATUS, MESSAGES } = require("../utils/constants");

const errorHandler = async (err, req, res, next) => {
  console.error("🔥 Error:", err.stack);

  const statusCode = err.statusCode || STATUS.SERVER_ERROR;
  const message = err.message || MESSAGES.SERVER_ERROR;

  // Check whether it’s admin or user route
  const view = req.originalUrl.startsWith("/admin")
    ? "admin/error"
    : "user/error";

  res.status(statusCode).render(view, {
    message,
    status: statusCode,
    user: req.session?.user || null,
  });
};

module.exports = errorHandler;