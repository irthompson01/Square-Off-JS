// Create dictionaries for tracking hosts, clients, and rooms
let hosts   = {};
let clients = {};
let rooms   = {};

////////////
// Setup express web server and listen on port 3000
// import express from 'express';
let express = require('express');
let app = express();
// let port=Number(process.env.PORT || 3000);
let port=Number(3000);
let server = app.listen(port);

app.use(express.static('./'));
console.log("My socket server is running on port " + port);

////////////
// Start socket.io
let socket = require('socket.io');

// Connect it to the web server
let io = socket(server);

////////////
// Setup a connection
// io.sockets.on('connection', newConnection);
io.on('connection', newConnection);
function newConnection(socket) {

  // Inform incoming connection of its ID
  console.log('\n' + socket.id + ' is attempting connection...');
  socket.emit('id', socket.id);

  // Process a request to join.
  socket.on('join', function (data) {

    // If request is from a client...
    if (data.name == 'client') {
      
      console.log("Verifying client...");

      // If the roomId field is not null
      if (data.roomId != null) {
        
        // Search existing roomIds for a match
        console.log("Searching for existing room ID...");
        if (rooms[data.roomId] != null) {

          // Add client to room with all connected clients 
          socket.join(data.name);

          // Add client and corresponding data to clients dictionary 
          // by socket ID
          clients[socket.id] = {
            type: data.name, 
            roomId: data.roomId
          }

          // Add client to its own room and to host room by room ID
          socket.join([socket.id, data.roomId]);
          console.log('Client added to room '+data.roomId+'.\tNumber of clients: ' + Object.keys(clients).length);

          // Send match confirmation back to client
          socket.emit("found", {status: true});
        }
        else {
          // Notify client of failure to match
          socket.emit("found", {status: false});
        }
      }
    } 
    else if (data.name == 'host') {
      // If the attempted connection is from a host...

      // Store a transmitted room ID if it exists, otherwise
      // generate a random gemstone name as room ID.
      let roomId = null;
      if (data.roomId === null || data.roomId === 'undefined') {
        roomId = makeIdFromList();
        console.log(roomId);
      }
      else {
        roomId = data.roomId;
        console.log("Assign roomId in server.js");
      }

      // Add client and corresponding data to devices dictionary 
      // by socket ID
      let hostData = {
        type: data.name,
        roomId: roomId
      };

      hosts[socket.id] = hostData;
      rooms[roomId] = socket.id;

      // Add host to "host" room, its own room by room ID, and to a room 
      // with its clients by room ID.
      socket.join([data.name, 'host:'+hostData.roomId, hostData.roomId]);

      // Send clients room ID back to host
      socket.emit("hostConnect", hostData);

      console.log('Host added with room ID of ' + hostData.roomId + '.\tNumber of hosts: ' + Object.keys(hosts).length);
    } 
    else {
      console.log('warning: data type not recognized.')
    }
  })

  //// Process device disconnects.
  socket.on('disconnect', function () {
    console.log('\n' + socket.id + ' has been disconnected!');

    if (clients[socket.id] != null) {
      // If the device is a client, delete it
      delete clients[socket.id];
      console.log('Client removed.\tNumber of clients: ' + Object.keys(clients).length);

      // Notify hosts that client has disconnected.
      socket.in('host').emit('clientDisconnect', {id: socket.id});
    } 
    else if (hosts[socket.id] != null) {
      // If the device is a host, delete it
      let roomId = hosts[socket.id].roomId;
      delete hosts[socket.id];
      console.log('Host with ID ' + roomId + ' removed.\tHumber of hosts: ' + Object.keys(hosts).length);

      // Remove corresponding room
      let key = getKeyByValue(rooms, socket.id);
      if (key != null) {
        delete rooms[key];
      }

      // TODO: add handling for all clients connected to host when host
      // is disconnected.
    }
  })

  //// Process client connects.
  socket.on('clientConnect', onClientConnect);

  function onClientConnect(data) {
    if (rooms[data.roomId] != null) {
      console.log('clientConnect message received from ' + socket.id + ' for room ' + data.roomId + ".");
      socket.in('host:'+data.roomId).emit('clientConnect', {id: socket.id, roomId: data.roomId});
    }
  }
  
  //// Reroute data sent between clients and hosts
  socket.on('sendData', sendData);

  function sendData(data) {
    let packet = {...data};
    packet.id = socket.id;
    
    // If room ID is valid...
    if (rooms[data.roomId] != null) {
      if (clients[socket.id] != null) {
        // And if device is a client, send to corresponding host
        socket.in('host:'+data.roomId).emit('receiveData', packet);
      }
      else if (hosts[socket.id] != null) {
        // And if device is a host, send to corresponding clients
        socket.broadcast.in(data.roomId).emit('receiveData', packet);
      }
    }
  }
}

////////////
// Utility Functions
function searchRoomId(roomId_, array_) {
  for (let i = 0; i < array_.length; i++) {
    if (array_[i].roomId == roomId_) {
      return {
        item: array_[i],
        index: i
      };
    }
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

////////////
// Gemstone room ID generator
const roomNames =
  ['abbey',
  'aircraftcarrier',
  'airplane',
  'alcove',
  'allegory',
  'alley',
  'altar',
  'alternatedimension',
  'amusementpark',
  'anarchy',
  'apartmentcomplex',
  'archaeologicaldig',
  'archipelago',
  'aristocracy',
  'assylum',
  'attic',
  'badmintoncourt',
  'bakery',
  'balcony',
  'barn',
  'barrack',
  'barrel',
  'baseballfield',
  'basement',
  'basket',
  'basketballcourt',
  'bathroom',
  'battlefield',
  'battleground',
  'battlezone',
  'bazaar',
  'beach',
  'beachhead',
  'bedroom',
  'beehive',
  'bin',
  'biplane',
  'blizzard',
  'bubble',
  'burgerjoint',
  'cabana',
  'cabaret',
  'cabin',
  'cabinet',
  'cafe',
  'cafeteria',
  'cage',
  'canofbeans',
  'canofpeas',
  'canofsoup',
  'can',
  'cannery',
  'canyon',
  'car',
  'cardboardbox',
  'carriage',
  'carrier',
  'castle',
  'cathedral',
  'cave',
  'cellar',
  'cemetary',
  'chamber',
  'chapel',
  'cinema',
  'cistern',
  'city',
  'classroom',
  'cliff',
  'cloudcity',
  'cloud',
  'clownschool',
  'cockpit',
  'colony',
  'compound',
  'computerscreen',
  'concerthall',
  'corral',
  'correctionalfacility',
  'courthouse',
  'courtyard',
  'cove',
  'crater',
  'crawlspace',
  'crevasse',
  'crypt',
  'cubby',
  'cubbyhole',
  'cubicle',
  'cupboard',
  'cyberworld',
  'deck',
  'den',
  'departmentstore',
  'desert',
  'dictatorship',
  'dictionary',
  'dimensionalportal',
  'ditch',
  'dock',
  'doghouse',
  'dollhouse',
  'dormitory',
  'dream',
  'drugstore',
  'dugout',
  'dump',
  'dungeon',
  'electromagnet',
  'elevator',
  'encyclopedia',
  'eruptingvolcano',
  'ethernetcable',
  'farm',
  'farmhouse',
  'fishpond',
  'fishery',
  'flashback',
  'forest',
  'forge',
  'fort',
  'forum',
  'fountain',
  'freeway',
  'frontier',
  'funeralhome',
  'furnace',
  'gallery',
  'garage',
  'garden',
  'garrison',
  'ghetto',
  'glacier',
  'grassland',
  'graveyard',
  'greenhouse',
  'grocerystore',
  'grove',
  'guardhouse',
  'gulf',
  'gully',
  'gutter',
  'gym',
  'hall',
  'hallway',
  'hamlet',
  'hangar',
  'harbor',
  'hideaway',
  'hideout',
  'highschool',
  'highway',
  'hill',
  'hospital',
  'hottub',
  'hotel',
  'house',
  'hovel',
  'impactsite',
  'improvstudio',
  'inn',
  'island',
  'isle',
  'islet',
  'jail',
  'jukebox',
  'jungle',
  'junkyard',
  'kitchen',
  'laboratory',
  'labyrinth',
  'lagoon',
  'lake',
  'lavatory',
  'library',
  'livingroom',
  'lockerroom',
  'lodge',
  'lookouttower',
  'lounge',
  'madhouse',
  'mainframe',
  'mall',
  'mapletree',
  'market',
  'marketplace',
  'maze',
  'meadow',
  'messofwires',
  'militarybase',
  'mine',
  'mineshaft',
  'monarchy',
  'monastery',
  'moon',
  'mosque',
  'motel',
  'mountain',
  'museum',
  'nest',
  'newsstand',
  'nightclub',
  'nursery',
  'oaktree',
  'ocean',
  'office',
  'orchard',
  'orphanage',
  'outpost',
  'pagoda',
  'palace',
  'palmtree',
  'parkinglot',
  'party',
  'peninsula',
  'penthouse',
  'petstore',
  'pharmasy',
  'picnic',
  'pier',
  'pileofgarbage',
  'pinetree',
  'pipeline',
  'pipingsystem',
  'pit',
  'planetarium',
  'planetoid',
  'plateau',
  'platform',
  'playroom',
  'plaza',
  'policedepartment',
  'pond',
  'poplartree',
  'portal',
  'powercord',
  'powerplant',
  'prison',
  'produceaisle',
  'pub',
  'pulpit',
  'purificationchamber',
  'pyramid',
  'quarry',
  'racetrack',
  'railroad',
  'rehabcenter',
  'resort',
  'restaurant',
  'river',
  'road',
  'room',
  'rosebush',
  'runway',
  'salon',
  'saloon',
  'sawmill',
  'school',
  'sculpture',
  'seacoast',
  'sewer',
  'shack',
  'shop',
  'shower',
  'skyline',
  'speedboat',
  'stable',
  'stadium',
  'stage',
  'storehouse',
  'storeroom',
  'street',
  'studio',
  'suburb',
  'subway',
  'supermarket',
  'swamp',
  'synagogue',
  'telephonewire',
  'tollhouse',
  'tomb',
  'tower',
  'town',
  'trashcan',
  'valley',
  'videogame',
  'village',
  'vineyard',
  'volcano',
  'warehouse',
  'warzone',
  'wasteland',
  'windmill',
  'yard',
  'zeppelin']

const roomIds = randomNoRepeats(roomNames);

function randomNoRepeats(array) {
  let copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    let index = Math.floor(Math.random() * copy.length);
    let item = copy[index];
    copy.splice(index, 1);
    return {id: item, length: copy.length};
  };
}

function makeIdFromList() {
  for (let i = 0; i < roomNames.length; i++) {
    let text = roomIds().id;
    let room = searchRoomId(text, hosts);
    if (room == null) {
      return text;
    }
  }
  console.log(hosts.length + " hosts detected. No names available.");
  return null;
}
