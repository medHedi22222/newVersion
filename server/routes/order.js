const router = require('express').Router();
const orderController = require("../controllers/orderController");

router.delete("/deleteOrder/:cartId", orderController.deleteOrder);
router.post("/createOrder", orderController.createOrder);
router.delete("/reset", orderController.resetOrder);

module.exports = router;