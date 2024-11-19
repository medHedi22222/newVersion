const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./conifg/db');
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

connection()
    .then((res) => {
        app
            .listen(process.env.PORT || 5000, () => {
                console.log("backend server is running");
            })
    })
    .catch((err) => { console.log("There is an error not expected"); });

app.use("/api/Carts", cartRoute);
app.use("/api/order", orderRoute);