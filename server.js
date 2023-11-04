require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const connectDB = require("./client/src/server/config/db");
const errorHandler = require("./client/src/server/middleware/error");

//Connecting to DB
connectDB();

app.use(express.json());

app.use("/api/auth", require("./client/src/server/routes/auth"));

//Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log("Server running on port " + PORT)
);

process.on("unhandledRejection", (err, promise) => {
  console.log("Logged Error:" + err);
  server.close(() => process.exit(1));
});
