const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoutes");
const categoryRouter = require("./routes/prodcategoryRoutes");
const blogCatRouter = require("./routes/blogCatRoutes");
const brandRouter = require("./routes/brandRoutes");
const colorRouter = require("./routes/colorRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const enquiryRouter = require("./routes/enqRoute");

const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogcat', blogCatRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/color', colorRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/enquiry", enquiryRouter);


app.use(notFound)
app.use(errorHandler);


// app.use('/', (req, res) => {
//     res.send("hello world hhhhhh");
// });

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});
