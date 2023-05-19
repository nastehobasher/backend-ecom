const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require('../utils/validateMongodbid');

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const getallCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updatecoupon = await Coupon.findOneAndUpdate(id, req.body, { new: true });

        res.json(updatecoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedcoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedcoupon);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = { createCoupon, getallCoupons, updateCoupon, deleteCoupon };