const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
        totalPrice: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
