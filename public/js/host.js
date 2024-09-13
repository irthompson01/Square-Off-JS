/*
p5.multiplayer - HOST

This 'host' sketch is intended to be run in desktop browsers. 
It connects to a node server via socket.io, from which it receives
rerouted input data from all connected 'clients'.

Navigate to the project's 'public' directory.
Run http-server -c-1 to start server. This will default to port 8080.
Run http-server -c-1 -p80 to start server on open port 80.

*/
// Network Settings

// // Load environment variables (Only for Node.js environment)
// require('dotenv').config();

// // Access environment variables
// const serverIp = process.env.SERVER_IP || '127.0.0.1';
// const serverPort = process.env.SERVER_PORT || '3000';
// const local = process.env.LOCAL === 'true';
const serverIp = '127.0.0.1';
const serverPort = '3000';
const local = true;

// Import Board Class
import {Board} from '../modules/online/board.js';
import {Score} from '../modules/online/score.js';

// p5.js implementation

function sketchBoard(p) {

  const A = animS.newAnimS(p);

  p.preload = function () {
    setupHost();
  }

  p.setup = function () {
    let canvasWidth = window.innerHeight*0.98;
    var cnv = p.createCanvas(canvasWidth, canvasWidth);

    var newGame = document.getElementById('startButton');
    newGame.addEventListener('click', p.newParams, false);

    p.background(220, 220, 220);
    // p.frameRate(30);

    var canvas = document.getElementById("boardContainer");
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasWidth + "px";
    var setup = document.getElementById("setupDisplay");
    setup.style.width = "14vw";
    var score = document.getElementById("scoreDisplay");
    score.style.width = "35vw";

    // setup players
    board.setup(p);
    // p.noLoop();
  }

  p.draw = function () {

    if(isHostConnected(true)){
        p.clear();

        // draw quadrants
        p.drawQuadrants();

        p.setLineDash([0, 0]);
        p.strokeWeight(5);
        p.stroke("#000000");

        board.tileSprites.draw();

        p.strokeWeight(2.5);
        p.setLineDash([5, 5]);

        board.squareSprites.draw();
        board.diamondSprites.draw();

        }

        

  }

  p.mouseClicked = function() {

    console.log("Board Server: ", board.serverId);
    console.log("Current Player Server: ", board.current_player.serverId);

    if(board.serverId == board.current_player.serverId){
    // A.reset();
        if (p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height){

        var tile = board.getTileClicked(p.mouseX, p.mouseY);
        // console.log("Coordinate x: " + p.mouseX,
        //             "Coordinate y: " + p.mouseY,
        //             "Tile ox: " + tile.origin_x,
        //             "Tile oy: " + tile.origin_y,
        //             tile);
        if (tile.occupant == -1) {
            board.totalSquares -= 1;
            tile.occupant = board.current_player.id;
            tile.fillColor = board.current_player.fillStyle;

            tile.sprite.color = board.current_player.fillStyle;
            tile.sprite.layer = 1;

            // Play sound
            board.sounds[0].play();
            board.sounds[5].pause();
            
            // Find new squares / diamonds
            board.findNewBoxes();
            // If no new squares, small rotate
            if (board.current_player.squaresFormed < 1){
            tile.sprite.rotate(90, 5);
            }
            // play a sound
            board.updateScore();
            // Move to the next player
            board.nextPlayer();

            waitingCount = interval;  

            let data = {
                "x": tile.index_x,
                "y": tile.index_y
            }

            sendData("tileSelect", data);

        }

        else {
            // play wrong sound
            }
        }
    console.log(board.totalSquares);
    // check if all squares are taken
    if (board.totalSquares == 0){
      waitingCount = 1000;

      let timer = document.getElementById("progressBar");
      if(typeof(timer) != 'undefined' && timer != null){
        timer.style.color = "white";
      }

      console.log("GAME OVER CUPCAKE");
      // 1 second delay
      setTimeout(function(){
        console.log("Executed after 1 second");
        board.endGame();
      }, 1000);
      
    }

    else {
      let timer = document.getElementById("progressBar");
      if(typeof(timer) != 'undefined' && timer != null){
        timer.style.color = "white";
      } 
    }
  }
      
  }

  p.drawQuadrants = function() {
    p.noFill();
    p.stroke("#000000");
    p.setLineDash([0, 0]);
    p.strokeWeight(5);
    p.rect(0, 0, p.width, p.width, 10);
    // If board size is even
    if(board.size % 2 == 0){
      p.rect(p.width*0.5, p.width*0.5,  p.width, p.width, 0, 0, 0, 10);
      p.rect(0, 0, p.width*0.5, p.width*0.5, 10, 0, 0, 0);

    }
    // Else board size is odd
    else {
      p.rect(0, 0, board.tile_length_px*(board.size-1)/2);
      p.rect(0, board.tile_length_px*(board.size+1)/2, board.tile_length_px*(board.size-1)/2);
      p.rect(board.tile_length_px*(board.size+1)/2, 0, board.tile_length_px*(board.size-1)/2);
      p.rect(board.tile_length_px*(board.size+1)/2, board.tile_length_px*(board.size+1)/2, board.tile_length_px*(board.size-1)/2);
    }
  }

  p.setLineDash = function(list) {
    p.drawingContext.setLineDash(list);
  }

  p.newParams = function(){
    let size = document.getElementById('boardSizeSelect').value;
    // let numPlayers = document.getElementById('numPlayersSelect').value;
    

    timer = document.getElementById('timerSelect').value;
    interval = +timer;
    waitingCount=interval;

    p.clear();
    board.reset(+size, p);
    board.sounds[2].play();
    board.sounds[3].play();

    let data = {
        "size": size,
        "timer" : timer
    }
    sendData("reset", data);
  }
}

function darkenColor(color, percent){
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R / 10) * 10
    G = Math.round(G / 10) * 10
    B = Math.round(B / 10) * 10

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

function tileSelect(data) {
    // Simulate tile click from client input
    var tile = board.grid[data.x][data.y];
      
      if (tile.occupant == -1) {
        board.totalSquares -= 1;
        tile.occupant = board.current_player.id;
        tile.fillColor = board.current_player.fillStyle;

        tile.sprite.color = board.current_player.fillStyle;
        tile.sprite.layer = 1;

        // Play sound
        board.sounds[0].play();
        board.sounds[5].pause();
        
        // Find new squares / diamonds
        board.findNewBoxes();
        // If no new squares, small rotate
        if (board.current_player.squaresFormed < 1){
          tile.sprite.rotate(90, 5);
        }
        
        // play a sound
        board.updateScore();
        // Move to the next player
        board.nextPlayer();

        waitingCount = interval;  

        sendData("tileSelect", data);

      }
}

function arrayRemove(arr, value) {
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function removePlayer(data) {
    board.players.forEach(player=>{
        if(player.serverId == data.id){

            board.players = arrayRemove(board.players, player);
            let playerDivId = 'player'+player.id + "div";
            let playerDiv = document.getElementById(playerDivId);
            playerDiv.remove();

            board.nextPlayer();


        }
    })
}

function nextPlayer(data) {
    if(board.current_player.id != data.playerId){
        document.getElementById("progressBar").innerHTML = "0";
        document.getElementById("progressBar").style.color="white";
        board.sounds[4].play();
        board.updateScore();
        board.nextPlayer();
        waitingCount = interval;
        let data = {
            "playerId": board.current_player.id
        }
        sendData("nextPlayer", data);
    }
}

function reset(data) {
    let size = data.size;
    // let numPlayers = document.getElementById('numPlayersSelect').value;
    timer = data.timer;
    interval = +timer;
    waitingCount=interval;

    sketch.clear();
    board.reset(+size, sketch);
    board.sounds[2].play();
    board.sounds[3].play();

    sendData("reset", data);

}

let boardSize = 8;
let timerSelect = 1000;

let players = [];

var sketch = new p5(sketchBoard, 'boardContainer');

var board = new Board(boardSize, sketch);

// Timer functionality
var timer = timerSelect;
var interval = +timer;
var waitingCount=interval; //Initialize counter
var progressBarId = setInterval(displayProgress ,1000);

function displayProgress() {
  if (waitingCount != 1000) {
    //create time if does not exist
    let timer = document.getElementById("progressBar");
    if(typeof(timer) != 'undefined' && timer != null){
    } 
    else{
        var div = document.getElementById('setupDisplay');
        timer = document.createElement('p');
        timer.setAttribute("class", "progressBar");
        timer.setAttribute("id", "progressBar");
        div.appendChild(timer);
    }
    

    document.getElementById("progressBar").style.backgroundColor = "#000";
    document.getElementById("progressBar").innerHTML = waitingCount;
    waitingCount -=1; //decrement counter
    if (waitingCount < 10){
      document.getElementById("progressBar").style.color="red";
    }
    if(waitingCount ===4){
      board.sounds[5].play();
    }
    if(waitingCount<0){
        if(board.current_player.serverId == board.serverId){
            document.getElementById("progressBar").innerHTML = "0";
            document.getElementById("progressBar").style.color="white";
            board.sounds[4].play();
            board.updateScore();
            board.nextPlayer();
            waitingCount = interval;
            let data = {
                "playerId": board.current_player.id
            }
            sendData("nextPlayer", data);
        }
      

    }
  }

  else {
    // delete timer if exists
    let timer = document.getElementById("progressBar");
    if(typeof(timer) != 'undefined' && timer != null){
      document.getElementById("progressBar").remove();
      }
  }
}

function onClientConnect (data) {
  console.log(data.id + ' has connected.');

  if (!board.checkId(data.id)) {
      let serverId = {
        "serverId": data.id
      }

      sendData("setBoardServerId", serverId);
      
      let defaultColors = ["#0583D2", "#FF3131", "#50C878", "#ee8329",
                              "#9933ff", "#66ffff", "#ff99ff", "#006600", 
                              "#990000", "#3333ff"];


      // Initialize player data to be sent to clients
      let playerId;
      if(board.players.length == 0){
        playerId = 1;
      }
      else {
        playerId = board.players[board.players.length-1].id + 1;
      }
      let playerName = "Player " + playerId;
      let color1 = defaultColors[playerId-1];
      let color2 = darkenColor(color1, -30);
      serverId = data.id;
      let player = new Score(playerId, serverId, [color2, color1], playerName);
      board.players.push(player);

      
      

    if(playerId == 1){
        board.current_player = board.players[0];
      }
    
    board.addPlayer(player, sketch);
      
    //   console.log(data);
    board.players.forEach(player =>{
        let playerData = {
            "playerId": player.id,
            "serverId": player.serverId,
            "playerName": player.name,
            "color1": player.fillStyle,
            "color2": player.outlineFillstyle
          }

        //   console.log(playerData);

        sendData("player", playerData);
    })
      
    }

  // <----
}

function onClientDisconnect (data) {
  // Client disconnect logic here. --->
  console.log(data.id + ' has disconnected.');

  removePlayer(data);

  let serverId = {
    "serverId": data.id
  }
  sendData("clientDisconnect", serverId);

  // <----
}

function onReceiveData (data) {
  // Input data processing here. --->
  console.log(data);

    if (data.type === 'tileSelect') {
        tileSelect(data);
    }

    if (data.type === 'reset') {
        reset(data);
    }
    if(data.type === "nextPlayer") {
        nextPlayer(data);
    }

}

// Send data from client to host via server
function sendData(datatype, data) {
  data.type   = datatype;
  data.roomId = roomId;
  
  socket.emit('sendData', data);
}

function setupHost() {
  _processUrl();

  let addr = serverIp;
  console.log("ADDR: " + addr);
  if (local) { addr = serverIp + ':' + serverPort; }
  socket = io.connect(addr);

  let roomId = makeIdFromList();

  console.log("Room ID from setupHost in host.js: " + roomId);

  socket.emit('join', {name: 'host', roomId: roomId});
  console.log(roomId + " joined to host");

  socket.on('id', function(data) {
    id = data;
    console.log("id: " + id);
  });

  socket.on('hostConnect', onHostConnect);
  socket.on('clientConnect', onClientConnect);
  socket.on('clientDisconnect', onClientDisconnect);
  socket.on('receiveData', onReceiveData);
  
}

function onHostConnect (data) {
  console.log("Host connected to server.");
  hostConnected = true;
  
  if (roomId === null || roomId === 'undefined') {
    roomId = data.roomId;
  }
  displayAddress();

    let defaultColors = ["#0583D2", "#FF3131", "#50C878", "#ee8329",
                              "#9933ff", "#66ffff", "#ff99ff", "#006600", 
                              "#990000", "#3333ff"];


    // Initialize player data to be sent to clients
    let serverId = "HOST";
    let playerId;

    if(board.players.length == 0){
        playerId = 1;
    }
    else {
        playerId = board.players[board.players.length-1].id + 1;
    }
    let playerName = "Player " + playerId;
    let color1 = defaultColors[playerId-1];
    let color2 = darkenColor(color1, -30);
    let player = new Score(playerId, serverId, [color2, color1], playerName);
    board.players.push(player);

    board.serverId = serverId


    if(playerId == 1){
        board.current_player = board.players[0];
      }
    
    board.addPlayer(player, sketch);

    
    let title = document.getElementById("h1-title");
    title.style.color = color1;
    

}

// Displays server address in lower left of screen
function displayAddress() {
  
  let roomLink = document.getElementById("roomLink");
  if(typeof(roomLink) != 'undefined' && roomLink != null){
    if(local){roomLink.innerText = serverIp + ':' + serverPort +"/html/guest.html?="+roomId;}
    
    else{
        roomLink.innerText = serverIp + "/html/guest.html?="+roomId;
    }
} 
  else{
        var div = document.getElementById('scoreDisplay');
        roomLink = document.createElement('h3');
        roomLink.setAttribute("class", "roomLink");
        roomLink.setAttribute("id", "roomLink");
        div.appendChild(roomLink);
        if(local){roomLink.innerText = serverIp + ':' + serverPort +"/html/guest.html?="+roomId;}
    
        else{
            roomLink.innerText = serverIp +"/html/guest.html?="+roomId;
        }
    }
    

  console.log(serverIp + ':' + serverPort +"/?="+roomId)
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
