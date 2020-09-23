require("dotenv").config({ path: "./variables.env" });
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/config");
const user = require("./routes/user");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Type, x-access-token, X-Access-Token"
  );
  next();
});
const mongoose = require("mongoose");
const mongoDB = config.db;
mongoose.connect(process.env.MONGOLAB_URI || mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

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
app.use(cors());

// const PORT = process.env.PORT | "1234";
// app.set("port", PORT);
// const server = app.listen(() => {
//   const port = server.address().port;
//   console.log("Server is up and running on port numner " + port);
// });

module.exports.handler = serverless(app);
