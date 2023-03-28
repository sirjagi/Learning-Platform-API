const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

// Moved to bootcamps.js
// app.get("/api/v1/bootcamps", (req, res) => {
//   // res.json({ name: "Jagi" });
//   // res.sendStatus(400);
//   res.status(200).json({ success: true, msg: "Show all bootcamps" });
// });

// app.get("/api/v1/bootcamps/:id", (req, res) => {
//   res
//     .status(200)
//     .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
// });

// app.post("/api/v1/bootcamps", (req, res) => {
//   res.status(200).json({ success: true, msg: "Create new bootcamp" });
// });

// app.put("/api/v1/bootcamps/:id", (req, res) => {
//   res
//     .status(200)
//     .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
// });

// app.delete("/api/v1/bootcamps/:id", (req, res) => {
//   res
//     .status(200)
//     .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
// });

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
// listen for unhandledRejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process (with failture, hence the 1)
  server.close(() => process.exit(1));
});
