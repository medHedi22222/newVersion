const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        image: { type: String, required: true },
        inStock: { type: Number, required: true },
        fastDelivery: { type: Boolean, required: true },
        ratings: { type: Number, required: true, min: 1, max: 5 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
