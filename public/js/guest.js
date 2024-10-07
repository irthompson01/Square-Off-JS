//////////// https://glitch.com/edit/#!/p5-multiplayer?path=README.md%3A1%3A0
// Network Settings

// Load environment variables (Only for Node.js environment)
// require('dotenv').config();

// // Access environment variables
// const serverIp = process.env.SERVER_IP || '127.0.0.1';
// const serverPort = process.env.SERVER_PORT || '3000';
// const local = process.env.LOCAL === 'true';
const serverIp = '127.0.0.1';
const serverPort = '3000';
const local = true;

// Import Board Class
import {Board} from '../modules/board.js';
import {Score} from '../modules/score.js';

// Import UI Utils Functions
import {setupScoreDisplay, resetScoreDisplay, addPlayerDisplay, updateScoreDisplay} from './uiUtils.js';

// p5.js implementation

function sketchBoard(p) {

  const A = animS.newAnimS(p);

  p.preload = function () {
    setupClient();
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
    setupScoreDisplay(board, p, false);
    // p.noLoop();
  }

  p.draw = function () {

    if(isClientConnected(true)){
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

        // displayAddress(p);

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
            updateScoreDisplay(board);
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
    board.reset(+size);
    resetScoreDisplay(board)
    board.sounds[2].play();
    board.sounds[3].play();

    let data = {
        "size": size,
        "timer" : timer
    }
    sendData("reset", data);
  }
}

function tileSelect(data) {
    //var tile = board.getTileClicked(data.x, data.y);
    var tile = board.grid[data.x][data.y];
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
        updateScoreDisplay(board);
        // Move to the next player
        board.nextPlayer();

        waitingCount = interval;  

      }
}

function arrayRemove(arr, value) {
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function removePlayer(data) {
    console.log("removePlayer");
    
    board.players.forEach(player=>{
        if(player.serverId == data.serverId){
            console.log("Inside loop");
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
        updateScoreDisplay(board);
        board.nextPlayer();
        waitingCount = interval;
        // let data = {
        //     "playerId": board.current_player.id
        // }
        // sendData("nextPlayer", data);
    }
}

function reset(data) {
    // if(board.totalSquares != data.size*data.size){
    let size = data.size;
    // let numPlayers = document.getElementById('numPlayersSelect').value;
    timer = data.timer;
    interval = +timer;
    waitingCount=interval;

    sketch.clear();
    board.reset(+size);
    resetScoreDisplay(board)
    board.sounds[2].play();
    board.sounds[3].play();
    //}
    

}
  
function onReceiveData (data) {
    // Input data processing here. --->
    

    if(data.type == "setBoardServerId"){
        // console.log(data);
        // console.log("1 -- Set board server id");
        if(board.serverId == null){
            board.serverId = data.serverId;
            displayAddress();
            // console.log("2 -- Set board server id");
        }
    }

    if(data.type == "player"){
      if(board.players.length == 0 || +data.playerId > board.players[board.players.length-1].id){
        //create new player
        
        let playerId = data.playerId;
        let playerName = data.playerName;
        let serverId = data.serverId;
        let color1 = data.color1;
        let color2 = data.color2;
        let player = new Score({id: playerId, serverId: serverId, color: [color2, color1], playerName: playerName});
        board.players.push(player);
        board.current_player = board.players[0];
        
        // Add player to display
        addPlayerDisplay(board, player, sketch);

        if(playerId == 1){
            board.current_player = board.players[0];
            // console.log(board.current_player);
        }
        if(board.serverId == data.serverId){
            let title = document.getElementById("h1-title");
            title.style.color = data.color1;
        }        
      }
    }

    if (data.type === 'tileSelect') {
        tileSelect(data);
    }

    if (data.type === 'reset') {
        reset(data);
    }

    if(data.type === "clientDisconnect") {
        removePlayer(data);
    }

    if(data.type === "nextPlayer") {
        nextPlayer(data);
    }

}

let boardSize = 8;
let timerSelect = 1000;
let players = [];

var sketch = new p5(sketchBoard, 'boardContainer');

var board = new Board(boardSize, players, sketch);



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
            updateScoreDisplay(board);
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

    // displayAddress();
  }

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
              roomLink.innerText = serverIp + "/html/guest.html?="+roomId;
          }
      }
      
  
    console.log(serverIp + ':' + serverPort +"/?="+roomId)
  }