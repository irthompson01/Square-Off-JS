// src/server.js
const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const dotenv = require("dotenv");
const socketHandlers = require("./controllers/socketHandlers");

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// Serve the main HTML file on the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

// Serve the config file
app.get("/api/config", (req, res) => {
  res.json({
    host: process.env.HOST || "127.0.0.1",
    port: process.env.PORT || "3000",
    local: process.env.LOCAL === "true",
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
