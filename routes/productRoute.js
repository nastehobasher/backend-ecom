const express = require('express');
const { createProduct, getaPoduct, getAllProduct, updateProduct, deleteProduct, AddToWishlist, rating } = require("../controller/productCtrl");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getaPoduct);
router.put("/wishlist", authMiddleware, AddToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/", getAllProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
