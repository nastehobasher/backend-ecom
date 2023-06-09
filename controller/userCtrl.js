const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const uniqid = require('uniqid');

const asyncHandler = require("express-async-handler");
const { genarateToken } = require('../config/jwtToken');
const validateMongodbId = require('../utils/validateMongodbid');
const { genarateRefreshToken } = require('../config/refreshToken');
const sendEmail = require('./emailCtrl');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
// const sendEmial = require("./emailCtrl");


const createUser = asyncHandler(async (req, res) => {
    const myemail = req.body.email;
    const findUser = await User.findOne({ email: myemail });
    if (!findUser) {
        console.log("creating user");
        //create a user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('user Already Exist')
    }
});

//login user
const LoginUserctrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await genarateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        },
            { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: genarateToken(findUser?._id),
        });
    }
    else {
        throw new Error("invalid Crediantials");
    }
});

// admin login

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await genarateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: genarateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

// handler refresh token
const handlerRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No Refresh token present in db or not matched');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("there us something wrong with refresh token");
        }
        const accessToken = genarateToken(user?._id);
        res.json({ accessToken })
    });
});

//logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204); //forbiden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",

    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204); //forbiden
});


// update a user 
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// save user Address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
})


// get all user
const getallUser = asyncHandler(async (req, res) => {

    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

// get a single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log("~~~~~~~~~> id in @getUser: ", id);
    validateMongodbId(id);
    try {
        const getaUser = await User.findById(id)
        res.json({
            getaUser,
        })
    } catch (error) {
        throw new Error(error);
    }
})
// delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id)
        res.json({
            deleteUser,
        })
    } catch (error) {
        throw new Error(error);
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const blockusr = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(blockusr);
    } catch (error) {
        throw new Error(error);
    }
});
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json(unblock);
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        console.log(updatedPassword);
        res.json(updatedPassword)
    }
    else {
        res.json(user);
    }
});
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please Follow this link to reset your Password. This link valid till 10 minutes from now.<a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(",,", error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token Expired, Please try again later ");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
});


const userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        // error not defined
        let newCart = await new Cart({
            userId: _id,
            productId,
            color,
            price,
            quantity
        }).save();
        // console.log(newCart);
        res.json(newCart);
    } catch (error) {
        throw new Error("hhhh", error);
    };
});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.find({ userId: _id })
            .populate("productId",)
            .populate('color');
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validateMongodbId(_id);
    try {
        const deleteprdoctfromcart = await Cart.deleteOne({ userId: _id, _id: cartItemId })
            .populate("productId",)
            .populate('color');
        res.json(deleteprdoctfromcart);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
    console.log("ma ku jirnnn");
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.params;
    validateMongodbId(_id);
    try {
        const cartItem = await Cart.findOne({
            userId: _id, _id: cartItemId
        })
        console.log("cartitem", cartItem);
        cartItem.quantity = newQuantity
        cartItem.save()
        res.json(cartItem);
    } catch (error) {
        console.log("errr", error);
        throw new Error(error);
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { shippingInfo, orderItem, totalPrice, totalPriceAfterDiscount, paymentInfo } = req.body;
    const { _id } = req.user;
    try {
        const order = await Order.create({
            shippingInfo, orderItem, totalPrice, totalPriceAfterDiscount, paymentInfo, user: _id
        });
        res.json({
            order,
            success: true
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const orders = await Order.find({ user: _id }).populate("user").populate("oderItems.product").populate("oderItems.color");
        res.json({
            orders,
        });
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = { createUser, LoginUserctrl, getallUser, getUser, deleteUser, updateaUser, blockUser, unblockUser, handlerRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, getWishlist, loginAdmin, saveAddress, userCart, getUserCart, createOrder, removeProductFromCart, updateProductQuantityFromCart, getMyOrders };


//  emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus, getAllOrders, getOrderByUserId, 