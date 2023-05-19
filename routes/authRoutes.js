const express = require('express');
const { createUser, LoginUserctrl, getallUser, getUser, deleteUser, updateaUser, blockUser, unblockUser, handlerRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, getWishlist, loginAdmin, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require('../controller/userCtrl');

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", LoginUserctrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.get("/all-users", getallUser);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/refresh", handlerRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, isAdmin, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateaUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;