
const STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  GONE: 410,
};


const MESSAGES = {
 
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_REQUEST: "Invalid request data.",
  PAGE_NOT_FOUND: "Page Not Found.",
  ACTION_FAILED: "Action failed. Please try again.",
  ACTION_SUCCESS: "Action completed successfully.",
  VALIDATION_ERROR: "Validation error. Please check your input.",

 
  USER_NOT_FOUND: "User not found.",
  USER_ALREADY_EXISTS: "User already exists.",
  USER_CREATED: "User account created successfully.",
  USER_UPDATED: "User profile updated successfully.",
  USER_DELETED: "User account deleted successfully.",
  PROFILE_IMAGE_UPDATED: "Profile image updated successfully.",
  PROFILE_UPDATE_FAILED: "Failed to update profile.",
  INVALID_USER_ID: "Invalid user ID provided.",
  EMAIL_ALREADY_EXISTS: "This email is already registered.",
  EMAIL_REQUIRED: "Email is required.",
  INVALID_EMAIL: "Invalid email format.",
  PHONE_ALREADY_EXISTS: "Phone number already registered.",
  USER_ACCOUNT_NOT_FOUND:"Account not found.",

  LOGIN_REQUIRED:"Login required",

  LOGIN_SUCCESS: "Login successful.",
  LOGIN_FAILED: "Invalid email or password.",
  LOGOUT_SUCCESS: "Logout successful.",
  UNAUTHORIZED: "Unauthorized access.",
  INVALID_CREDENTIALS: "Invalid credentials provided.",
  PASSWORD_INCORRECT: "Incorrect current password.",
  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_CHANGED: "Password changed successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successful.",
  PASSWORD_RESET_FAILED: "Failed to reset password.",
  CURRENT_PASSWORD_REQUIRED: "Current password is required.",
  NEW_PASSWORD_REQUIRED: "New password is required.",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger one.",
  OTP_SENT: "OTP sent successfully.",
  OTP_VERIFIED: "OTP verified successfully.",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  OTP_INVALID: "Invalid OTP. Please try again.",

  PRODUCT_FETCH_SUCCESS: "Products fetched successfully.",
  PRODUCT_DISCONTINUED: "This product has been discontinued and is no longer available.",
  PRODUCT_NOT_FOUND: "No products found.",
  PRODUCT_CREATED: "Product added successfully.",
  PRODUCT_UPDATED: "Product updated successfully.",
  PRODUCT_DELETED: "Product deleted successfully.",
  PRODUCT_OUT_OF_STOCK: "This product is currently out of stock.",
  PRODUCT_ALREADY_EXISTS: "Product with this name already exists.",
  PRODUCT_UNAVAILABLE: "Product unavailable.",
  PRODUCT_ADDED_TO_CART: "Product added to cart.",
  PRODUCT_REMOVED_FROM_CART: "Product removed from cart.",
  PRODUCT_QUANTITY_LIMIT: "Product quantity limit reached.",
  PRODUCT_DETAILS_SUCCESS: "Product details fetched successfully.",
  PRODUCT_DETAILS_FAILED: "Failed to fetch product details.",

  CATEGORY_NOT_FOUND: "Category not found.",
  CATEGORY_FETCH_SUCCESS: "Categories fetched successfully.",
  CATEGORY_CREATED: "Category created successfully.",
  CATEGORY_UPDATED: "Category updated successfully.",
  CATEGORY_DELETED: "Category deleted successfully.",
  CATEGORY_EXISTS: "Category already exists.",
  SUBCATEGORY_NOT_FOUND: "Subcategory not found.",
  FILTER_SUCCESS: "Filter applied successfully.",
  FILTER_FAILED: "Failed to apply filters.",

  // 🛒 Cart
  CART_FETCH_SUCCESS: "Cart fetched successfully.",
  CART_EMPTY: "Your cart is empty.",
  ITEM_ADDED_TO_CART: "Item added to cart.",
  ITEM_REMOVED_FROM_CART: "Item removed from cart.",
  CART_UPDATED: "Cart updated successfully.",
  CART_CLEAR_SUCCESS: "Cart cleared successfully.",
  CART_ITEM_QUANTITY_LIMIT: "You have reached the maximum quantity for this item.",
   ADDRESS_ADDED: "Address added successfully.",
  ADDRESS_UPDATED: "Address updated successfully.",
  ADDRESS_DELETED: "Address deleted successfully.",
  ADDRESS_NOT_FOUND: "Address not found.",
  DEFAULT_ADDRESS_SET: "Default address set successfully.",
  INVALID_ADDRESS_ID: "Invalid address ID provided.",
  ADDRESS_LIMIT_REACHED: "You can only add up to 5 addresses.",
  ADDRESS_ALREADY_EXISTS: "This address already exists.",
  BILLING_ADDRESS_REQUIRED: "Billing address is required.",
  SHIPPING_ADDRESS_REQUIRED: "Shipping address is required.",
  ADDRESS_FETCH_SUCCESS: "Address fetched successfully.",
  ADDRESS_FETCH_FAILED: "Failed to fetch address details.",


  // 💳 Payment / Wallet
  PAYMENT_SUCCESS: "Payment successful.",
  PAYMENT_FAILED: "Payment failed. Please try again.",
  PAYMENT_PENDING: "Payment is pending confirmation.",
  REFUND_SUCCESS: "Refund processed successfully.",
  REFUND_FAILED: "Refund failed.",
  INSUFFICIENT_FUNDS: "Insufficient wallet balance.",
  WALLET_TOPUP_SUCCESS: "Wallet recharged successfully.",
  WALLET_TOPUP_FAILED: "Wallet recharge failed.",

  // 📦 Order
  ORDER_PLACED: "Order placed successfully.",
  ORDER_FAILED: "Order placement failed.",
  ORDER_NOT_FOUND: "Order not found.",
  ORDER_CANCELLED: "Order cancelled successfully.",
  ORDER_RETURN_REQUESTED: "Return request submitted successfully.",
  ORDER_RETURN_APPROVED: "Return request approved.",
  ORDER_RETURN_REJECTED: "Return request rejected.",
  ORDER_RETURN_COMPLETED: "Order return completed and amount refunded to wallet.",
  ORDER_UPDATED: "Order updated successfully.",
  ORDER_STATUS_CHANGED: "Order status updated successfully.",

  // 💬 Review / Rating
  REVIEW_ADDED: "Review added successfully.",
  REVIEW_FAILED: "Failed to add review.",
  REVIEW_ALREADY_EXISTS: "You have already reviewed this product.",
  REVIEW_DELETED: "Review deleted successfully.",
  RATING_SUCCESS: "Rating submitted successfully.",

  // 🧑‍💼 Admin / Dashboard
  ADMIN_ACCESS_DENIED: "You do not have admin privileges.",
  ADMIN_LOGIN_SUCCESS: "Admin login successful.",
  ADMIN_LOGIN_FAILED: "Invalid admin credentials.",
  DASHBOARD_DATA_FETCHED: "Dashboard data fetched successfully.",
  ADMIN_ACTION_FAILED: "Admin action failed.",
  ADMIN_ACTION_SUCCESS: "Admin action completed successfully.",

  // 🧾 Coupon / Offers
  COUPON_APPLIED: "Coupon applied successfully.",
  COUPON_INVALID: "Invalid or expired coupon.",
  COUPON_EXPIRED: "Coupon has expired.",
  COUPON_NOT_FOUND: "Coupon not found.",
  COUPON_REMOVED: "Coupon removed successfully.",

  // ✉️ Email / Notification
  EMAIL_SENT: "Email sent successfully.",
  EMAIL_FAILED: "Failed to send email.",
  VERIFICATION_EMAIL_SENT: "Verification email sent successfully.",
  VERIFICATION_EMAIL_FAILED: "Failed to send verification email.",
};

module.exports = { STATUS, MESSAGES };
