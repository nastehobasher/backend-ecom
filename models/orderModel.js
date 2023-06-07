const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shippinInfo:
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        other: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
    },
    paymentInfo: {
        razorpayOrderId: {
            type: String,
            required: true
        },
        razorpayPaymentId: {
            type: String,
            required: true
        },
    },
    orderItems: [
        {
            products: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            color: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true
            },
        }
    ],

    paidAt: {
        type: Date,
        default: Date.now()
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        default: true,
    },
},
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);