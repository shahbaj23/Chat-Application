const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./userRoutes/authRoutes");
const messageRoute = require("./userRoutes/messageRoute");
const userRoute = require("./userRoutes/userRoute");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/api/user", authRoutes);
app.use("/api/message", messageRoute);
app.use("/api", userRoute);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGOURI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connected to MongoDB successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
