////////////
// COMMON

// Initialize Network related variables

let socket;
let roomId          = null;
let id              = null;

// const serverIp      = '127.0.0.1';
// const serverPort    = '3000';
// const local         = true;  

const serverIp = "https://square-off.com"
const serverPort    = '3000';
const local         = false;   

// Process URL
// Used to process the room ID. In order to specify a room ID,
// include ?=uniqueName, where uniqueName is replaced with the 
// desired unique room ID.
function _processUrl() {
  const parameters = location.search.substring(1).split("&");
  const temp = parameters[0].split("=");
  roomId = unescape(temp[1]);

  console.log("id: " + roomId);
}

// Send data from client to host via server
function sendData(datatype, data) {
  data.type   = datatype;
  data.roomId = roomId;
  
  socket.emit('sendData', data);
}

// Displays a message while attempting connection
function _displayWaiting() {
  push();
    fill(100);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Attempting connection...", width/2, height/2-10);
  pop();
}

////////////
// HOST

// Initialize Network related variables
let hostConnected   = false;

function setupHost() {
  _processUrl();

  let addr = serverIp;
  if (local) { addr = serverIp + ':' + serverPort; }
  socket = io.connect(addr);
  let roomId = makeIdFromList();

  socket.emit('join', {name: 'host', roomId: roomId});

  socket.on('id', function(data) {
    id = data;
    console.log("id: " + id);
  });

  socket.on('hostConnect', onHostConnect);
  socket.on('clientConnect', onClientConnect);
  socket.on('clientDisconnect', onClientDisconnect);
  socket.on('receiveData', onReceiveData);
}

function isHostConnected(display=false) {
  if (!hostConnected) {
    if (display) { 
      // _displayWaiting(); 
    }
    return false;
  }
  return true;
}

function onHostConnect (data) {
  console.log("Host connected to server.");
  hostConnected = true;
  
  if (roomId === null || roomId === 'undefined') {
    roomId = data.roomId;
  }
}

// Displays server address in lower left of screen
function displayAddress(p) {
  // push();
  // p.fill(255);
  // p.textSize(50);
  // p.text(serverIp+"/?="+roomId, 10, height-50);
  // console.log("ADDY: " + serverIp + ':' + serverPort +"/?="+roomId)
  // pop();
}

////////////
// CLIENT

// Initialize Network related variables
let waiting         = true;
let connected       = false;

function setupClient() {
  _processUrl();

  // Socket.io - open a connection to the web server on specified port
  let addr = serverIp;
  if (local) { addr = serverIp + ':' + serverPort; }
  socket = io.connect(addr);

  socket.emit('join', {name: 'client', roomId: roomId});

  socket.on('id', function(data) {
    id = data;
    console.log("id: " + id);
  });

  socket.on('found', function(data) {
    connected = data.status;
    waiting = false;
    console.log("connected: " + connected);
  })
  
  socket.emit('clientConnect', {
    roomId: roomId
  });

  socket.on('receiveData', onReceiveData);
}

function isClientConnected(display=false) {
  // console.log("Is client connected");
  if (waiting) {
    if (display) {
      //  _displayWaiting(); 
      }
    return false;
  } 
  else if (!connected) {
    if (display) { 
      // _displayInstructions(); 
    }
    return false;
  }

  return true;
}

// Displays a message instructing player to look at host screen 
// for correct link.
function _displayInstructions() {
  push();
    fill(200);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Please enter the link at the", width/2, height/2-10);
    text("bottom of the host screen.", width/2, height/2+10);
  pop();
}

function onClientConnect (data) {
  console.log(data.id + ' has connected.');

  if (!board.checkId(data.id)) {
      var div = document.getElementById('scoreDisplay');
      let playerName = "Player " + data.id;

      let defaultColors = ["#0583D2", "#FF3131", "#50C878", "#ee8329",
                              "#9933ff", "#66ffff", "#ff99ff", "#006600", 
                              "#990000", "#3333ff"];

      let color1 = defaultColors[0];
      let color2 = darkenColor(color1, -30);
      let player = new Score(data.id, [color1, color2], playerName)
      
      
      board.addPlayer(div, player, p);
      
      // board.add(data.id,
      //         random(0.25*width, 0.75*width),
      //         random(0.25*height, 0.75*height),
      //         60, 60
      // );
    }

  // <----
}

function onClientDisconnect (data) {
  // Client disconnect logic here. --->
  console.log(data.id + ' has disconnected.');

  // <----
}

function onReceiveData (data) {
  // Input data processing here. --->
  console.log(data);

  // <---

  /* Example:
      if (data.type === 'myDataType') {
          processMyData(data);
      }

      Use `data.type` to get the message type sent by client.
  */

}

// Create dictionaries for tracking hosts, clients, and rooms
let hosts   = {};
let clients = {};
let rooms   = {};

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
