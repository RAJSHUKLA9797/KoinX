//import lib
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//routes import
const uploadCsv = require("./routes/uploadCsvRoute");
const balanceRouter = require("./routes/balance");
//
const app = express();
module.exports = app;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connection
const DB_URL = "mongodb://127.0.0.1:27017/KoinX";
mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => console.log("error connecting to mongodb" + err));

///routes
// app.use("/api", taskRoute);
// app.use("/api", subtaskRoute);

app.use("/api", uploadCsv);
app.use("/api", balanceRouter);

app.get("/", (req, res) => {
  res.send("Looks fine, now check the other routes!");
});
app.listen(4000, () => {
  console.log("on port 4000!!!");
});
