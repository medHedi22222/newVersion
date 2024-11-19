const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");

async function createOrder(req, res) {
    try {
        const { cartId } = req.body;
        if (!cartId) {
            return res.status(400).json({ error: "cartId is required." });
        }

        // Fetch the cart to calculate the total price
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart item not found." });
        }

        // Create a new order with the total price of the cart item
        const newOrder = new Order({
            cartId,
            totalPrice: cart.price,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create order." });
    }
}

async function deleteOrder(req, res) {
    try {
        const { cartId } = req.params; // Extract `cartId` from the route parameters
        if (!cartId) {
            return res.status(400).json({ error: "Cart ID is required." });
        }

        // Find and delete the order by `cartId`
        const order = await Order.findOneAndDelete({ cartId });
        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }

        res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete order." });
    }
}

async function resetOrder(req, res) {
    try {
        // Delete all documents from the "orders" collection
        const result = await Order.deleteMany({});

        res.status(200).json({
            message: "All orders deleted successfully.",
            deletedCount: result.deletedCount // Optionally include the count of deleted documents
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete all orders." });
    }
}






module.exports = {
    createOrder,
    deleteOrder,
    resetOrder
};
