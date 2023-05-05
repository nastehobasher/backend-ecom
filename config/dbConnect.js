const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("database Connected succesfuly");
    } catch (error) {
        console.log("database error");
    }
}
mongoose.set('strictQuery', false);
module.exports = dbConnect;