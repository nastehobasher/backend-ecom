const express = require('express');
const { createUser, LoginUserctrl, getallUser, getUser, deleteUser, updateaUser, blockUser, unblockUser, handlerRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, getWishlist, loginAdmin, saveAddress, userCart, getUserCart, emptyCart, createOrder, removeProductFromCart, updateProductQuantityFromCart, getMyOrders } = require('../controller/userCtrl');

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require('../controller/paymentCtrl');
const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", LoginUserctrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
// router.post("/order/checkout", authMiddleware, checkout);
// router.post("/order/paymentVerification", authMiddleware, paymentVerification);

router.post("/cart/create-order", authMiddleware, createOrder);

router.get("/all-users", getallUser);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/refresh", handlerRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/update-product-cart/:cartItemId/:newQuantity", authMiddleware, updateProductQuantityFromCart);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateaUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;