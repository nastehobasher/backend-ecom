const Category = require("../models/prodcategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require('../utils/validateMongodbid');
const User = require("../models/userModel");


const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory)
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const upddatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(upddatedCategory)
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error);
    }
})

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getallCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await Category.find();
        res.json(getallCategory);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getallCategory };