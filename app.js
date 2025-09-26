require('dotenv').config();
const express = require('express');
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require('./config/connectDB');
const authRoutes = require('./router/authroute');
const taskRoutes = require('./router/tasks');

const app = express();
const PORT = process.env.PORT || 8000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect database
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  res.render("home", { user });
});

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
