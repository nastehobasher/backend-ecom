const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");


const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    // console.log("has Bearer? ", req.headers?.authorization?.startsWith("Bearer"));
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            // console.log("token:", token);
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log("~decoded", decoded);
                const user = await User.findById(decoded?.id);
                req.user = user;
                // console.log("{{user", user);
                next();
            }
        } catch (error) {
            console.log(">>>", error);
            throw new Error("Not Authorizes token expired, Please Login again");
        }
    } else {
        console.log(">>>>> else @authMiddleware!")
        throw new Error("There is no token attached to header");
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    // console.log(req.user);
    const { email } = req.user;
    const AdminUser = await User.findOne({ email });
    if (AdminUser.role !== "admin") {
        throw new Error("You are not an admin");
    } else {
        // console.log("@isAdmin... Yes Ok to go!");
        next();
    }
});

module.exports = { authMiddleware, isAdmin };
