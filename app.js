require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));

app.use(cors());
app.set("view engine", "ejs");
app.set("views", "views");

const dbConnection = require("./app/config/db");
dbConnection();
app.use(express.json());

const adminAuthRoute = require("./app/routes/adminAuthRoute");
app.use(adminAuthRoute);

const categoryRoute = require("./app/routes/categoryRoute");
app.use(categoryRoute);

const productRoute = require("./app/routes/productRoute");
app.use(productRoute);

const supplierRoute = require("./app/routes/supplierRoute");
app.use(supplierRoute);

const orderRoute = require('./app/routes/orderRoute');
app.use(orderRoute)

const port = 7005;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
