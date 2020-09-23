const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/config");
const user = require("./routes/user");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
const cors = require("cors");

const app = express();

const mongoose = require("mongoose");
const mongoDB = config.db;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.use("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/users", user);

app.use(
  "/api-docs",
  (req, res, next) => {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup()
);

const port = process.env.PORT | 1234;
app.listen(port, () => {
  console.log("Server is up and running on port numner " + port);
});
