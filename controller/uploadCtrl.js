const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");


const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const images = urls.map((file) => {
            return file;
        });
        res.json(images);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, "images");
        res.json({ message: "Deleted" });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    uploadImages,
    deleteImages,
};

// const fs = require("fs");
// const asyncHandler = require("express-async-handler");


// const {
//     cloudinaryUploadImg,
//     cloudinaryDeleteImg,
// } = require("../utils/cloudinary");

// const uploadImages = asyncHandler(async (req, res) => {
//     // console.log('req.files : ', req.file);
//     try {
//         const uploader = async (path) => await cloudinaryUploadImg(path, "image");
//         console.log("hsaskdnm", uploader);
//         let urls = [];
//         const files = req.files;
//         // console.log("~~~~~", Object.keys(req));
//         console.log("∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞> ", files);
//         for (let file of files) {
//             let path = `../public/images/${file.originalname}`;
//             // let path = file.originalname;
//             // const newpath = await uploader(path);
//             console.log("§§§§Path: ", path);
//             let newpath = await cloudinaryUploadImg(path);
//             console.log(newpath);
//             urls.push(newpath);
//             fs.unlinkSync(path);
//         }
//         const images = urls.map((file) => {
//             return file;
//         });
//         // console.log("json", images)
//         res.json(images);
//         res.json({});
//     } catch (error) {
//         throw new Error(error);
//     }
// });
// const deleteImages = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const deleted = cloudinaryDeleteImg(id, "images");
//         res.json({ message: "Deleted" });
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// module.exports = {
//     uploadImages,
//     deleteImages,
// };

