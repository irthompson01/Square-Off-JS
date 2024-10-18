// src/utils/roomUtils.js
const fs = require("fs");
const path = require("path");

// Load room names from JSON file
const roomNames = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/roomIds.json"), "utf8"),
);
const roomIds = randomNoRepeats(roomNames);

function randomNoRepeats(array) {
  let copy = array.slice(0);
  return function () {
    if (copy.length < 1) {
      copy = array.slice(0);
    }
    let index = Math.floor(Math.random() * copy.length);
    let item = copy[index];
    copy.splice(index, 1);
    return { id: item, length: copy.length };
  };
}

function makeIdFromList() {
  for (let i = 0; i < roomNames.length; i++) {
    let text = roomIds().id;
    if (!Object.values(hosts).some((host) => host.roomId === text)) {
      return text;
    }
  }
  console.log("No names available.");
  return null;
}

module.exports = {
  randomNoRepeats,
  makeIdFromList,
};
