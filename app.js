const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));

app.use(cors());
app.set("view engine", "ejs");
app.set("views", "views");

const dbConnection = require("./app/config/db");
dbConnection();

// const dashboard = async (req, res) => {
//   return res.render("dashboard");
// };

const dashboardRoute = require("./app/routes/dashboardRoute");
app.use(dashboardRoute);

const port = 7005;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
