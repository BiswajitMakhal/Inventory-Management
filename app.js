require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.static("public"));

app.use(cors());
app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
);

app.use(cookieParser());

const dbConnection = require("./app/config/db");
dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userAuthRoute = require("./app/routes/userAuthRoute");
app.use(userAuthRoute);

const categoryRoute = require("./app/routes/categoryRoute");
app.use(categoryRoute);

const productRoute = require("./app/routes/productRoute");
app.use(productRoute);

const supplierRoute = require("./app/routes/supplierRoute");
app.use(supplierRoute);

const orderRoute = require("./app/routes/orderRoute");
app.use(orderRoute);

const dashboardRoute = require("./app/routes/dashboardRoute");
app.use(dashboardRoute);

const paymentRoute = require("./app/routes/paymentRoute");
app.use(paymentRoute);

const userFrontedRoute = require("./app/routes/userFrontendRoute");
app.use("/user", userFrontedRoute);

const PORT = process.env.PORT || 7005;
app.listen(PORT, () => {
  console.log(`http://localhost:${port}`);
});
