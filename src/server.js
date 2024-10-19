// src/server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const dotenv = require("dotenv");
const socketHandlers = require("./controllers/socketHandlers");
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT
const host = process.env.HOST

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the auth routes
app.use('/auth', authRoutes);

// Serve the main HTML file on the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

// Serve the config file
app.get("/config", (req, res) => {
  res.json({
    host: process.env.HOST,
    port: process.env.PORT,
    local: process.env.LOCAL,
  });
});

// Create an HTTP server and attach Socket.io to it
const server = http.createServer(app);
const io = socket(server);

// Handle socket connections
io.on("connection", socketHandlers(io));

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
});
