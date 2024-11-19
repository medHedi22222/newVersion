const Cart = require("../models/cartSchema");


async function createCartItem(req, res) {
    try {
        const { name, price, image, inStock, fastDelivery, ratings } = req.body;
        if (!name || !price || !image || !inStock || fastDelivery === undefined || !ratings) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const newCartItem = new Cart({
            name,
            price,
            image,
            inStock,
            fastDelivery,
            ratings
        });
        const savedCartItem = await newCartItem.save();
        res.status(201).json({
            id: savedCartItem._id,
            name: savedCartItem.name,
            price: savedCartItem.price,
            image: savedCartItem.image,
            inStock: savedCartItem.inStock,
            fastDelivery: savedCartItem.fastDelivery,
            ratings: savedCartItem.ratings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create cart item." });
    }
};

async function getAllCarts(req, res) {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
}




module.exports = {
    getAllCarts, createCartItem
}