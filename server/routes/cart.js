const router = require('express').Router();
const cartController = require("../controllers/cartControllers");

router.get("/", cartController.getAllCarts)
router.post("/", cartController.createCartItem)


module.exports = router;