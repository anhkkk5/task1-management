const express = require("express");
const cors = require("cors");

const database = require("./config/database");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routeApiVer1 = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

app.use(cors());
database.connect();

app.use(bodyParser.json());
app.use(cookieParser());

//Routes Version 1
routeApiVer1(app);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
