// src/controllers/socketHandlers.js

const { makeIdFromList } = require("../utils/roomUtils");

// Create dictionaries for tracking hosts, clients, and rooms
let hosts = {};
let clients = {};
let rooms = {};

module.exports = (io) => {
  return (socket) => {
    console.log(`${socket.id} is attempting connection...`);
    socket.emit("id", socket.id);

    // Handle join requests
    socket.on("join", (data) => {
      if (data.name === "client") {
        handleClientJoin(socket, data);
      } else if (data.name === "host") {
        handleHostJoin(socket, data);
      } else {
        console.log("Warning: data type not recognized.");
      }
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });

    // Handle client connections
    socket.on("clientConnect", (data) => {
      handleClientConnect(socket, data);
    });

    // Handle data sending between clients and hosts
    socket.on("sendData", (data) => {
      handleSendData(socket, data);
    });
  };
};

function handleClientJoin(socket, data) {
  console.log("Verifying client...");

  if (data.roomId != null && rooms[data.roomId]) {
    clients[socket.id] = { type: "client", roomId: data.roomId };
    socket.join([socket.id, data.roomId]);
    console.log(`Client added to room ${data.roomId}.`);
    socket.emit("found", { status: true });
  } else {
    socket.emit("found", { status: false });
  }
}

function handleHostJoin(socket, data) {
  let roomId = data.roomId || makeIdFromList();
  console.log(`Host room ID: ${roomId}`);

  hosts[socket.id] = { type: "host", roomId: roomId };
  rooms[roomId] = socket.id;

  socket.join([`host:${roomId}`, roomId]);
  socket.emit("hostConnect", { type: "host", roomId: roomId });

  console.log(`Host added with room ID ${roomId}.`);
}

function handleDisconnect(socket) {
  console.log(`${socket.id} has disconnected!`);

  if (clients[socket.id]) {
    let roomId = clients[socket.id].roomId;

    console.log(`Client found in clients: ${clients[socket.id]}`);
    delete clients[socket.id];
    console.log("Client removed.");
    socket.to(`host:${roomId}`).emit("clientDisconnect", { id: socket.id });
  } else if (hosts[socket.id]) {
    let roomId = hosts[socket.id].roomId;
    delete hosts[socket.id];
    delete rooms[roomId];
    console.log(`Host with room ID ${roomId} removed.`);
  } else {
    console.log("Disconnected socket not found in clients or hosts.");
  }
}

function handleClientConnect(socket, data) {
  if (rooms[data.roomId]) {
    console.log(`Client connecting to room ${data.roomId}`);
    socket
      .in(`host:${data.roomId}`)
      .emit("clientConnect", { id: socket.id, roomId: data.roomId });
  }
}

function handleSendData(socket, data) {
  let packet = { ...data, id: socket.id };
  if (rooms[data.roomId]) {
    if (clients[socket.id]) {
      socket.in(`host:${data.roomId}`).emit("receiveData", packet);
    } else if (hosts[socket.id]) {
      socket.broadcast.in(data.roomId).emit("receiveData", packet);
    }
  }
}
