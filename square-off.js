
// Import Board Class
import {Board} from './modules/board.js';
import {Score} from './modules/score.js';

// p5.js implementation

// TODO: Switch setup and score divs
// Add timer to each player div

function sketchBoard(p) {

  const A = animS.newAnimS(p);

  p.setup = function () {
    var cnv = p.createCanvas(window.innerHeight*0.98,window.innerHeight*0.98);

    var newGame = document.getElementById('startButton');
    newGame.addEventListener('click', p.newParams, false);

    p.background(220, 220, 220);
    p.frameRate(30);

    var canvas = document.getElementById("boardContainer");
    canvas.style.width = window.innerHeight*0.98 + "px";
    canvas.style.height = window.innerHeight*0.98 + "px";
    var setup = document.getElementById("setupDisplay");
    setup.style.width = "14vw";
    var score = document.getElementById("scoreDisplay");
    score.style.width = "35vw";

    // draw outline and quadrants
    p.noFill();
    p.strokeWeight(5);
    // p.rect(0, 0, p.width, p.width);
    if(board.size % 2 == 0){
      p.rect(p.width*0.5, p.width*0.5,  p.width, p.width);
      p.rect(0, 0, p.width*0.5, p.width*0.5);

    }
    else {
      p.rect(0, 0, board.tile_length_px*(board.size-1)/2);
    }
    // draw grid
    board.grid.forEach(row => {
      row.forEach(tile => {
        p.strokeWeight(2);
        p.noFill();
        p.rect(tile.origin_x, tile.origin_y, tile.length, tile.length, 2);
      });
    });
    p.noFill();
    p.stroke('#000000')
    p.setLineDash([0, 0]);
    p.strokeWeight(5);
    p.rect(0, 0, p.width, p.width, 10, 0, 10, 0);
    // If board size is even
    if(board.size % 2 == 0){
      p.rect(p.width*0.5, p.width*0.5,  p.width, p.width);
      p.rect(0, 0, p.width*0.5, p.width*0.5);

    }
    // Else board size is odd
    else {
      p.rect(0, 0, board.tile_length_px*(board.size-1)/2);
      p.rect(0, board.tile_length_px*(board.size+1)/2, board.tile_length_px*(board.size-1)/2);
      p.rect(board.tile_length_px*(board.size+1)/2, 0, board.tile_length_px*(board.size-1)/2);
      p.rect(board.tile_length_px*(board.size+1)/2, board.tile_length_px*(board.size+1)/2, board.tile_length_px*(board.size-1)/2);
    }
    // setup players
    board.setup(p);
    p.noLoop();
  }

  p.draw = function () {
    
    // fill tiles
    p.fillTiles();
    
    // draw quadrants
    p.drawQuadrants();
    
    // draw squares
    p.drawSquares();

    // draw new squares
    p.drawNewSquares();

  }

  p.mousePressed = function() {
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

        // Play sound
        board.sounds[0].play();
        board.sounds[5].pause();
        // Find new squares / diamonds
        board.findNewBoxes();
        // play a sound
        board.updateScore();
        // Move to the next player
        board.nextPlayer();

        // redraw if valid click
        p.redraw();

        waitingCount = interval;

        

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

  p.fillTiles = function() {
    // fill in tiles
    board.grid.forEach(row => {
      row.forEach(tile => {
        p.strokeWeight(2);
        p.fill(tile.fillColor);
        p.stroke('#000000');
        p.setLineDash([0, 0]);
        p.rect(tile.origin_x, tile.origin_y, tile.length, tile.length, 4);
      })
    });

  }

  p.drawNewSquares = function() {

    board.players.forEach(player => {
      p.stroke('#FFD700');
      p.strokeWeight(6);
      p.setLineDash([0, 0]);

      player.newSquares.forEach(square => {
        if(square.type == 'diamond'){
          
          p.beginShape();
          p.vertex(square.top_x, square.top_y);
          p.vertex(square.right_x, square.right_y);
          p.vertex(square.bottom_x, square.bottom_y);
          p.vertex(square.left_x, square.left_y);
          p.endShape(p.CLOSE);
        }
        else {
          p.rect(square.origin_x, square.origin_y, square.length, square.length);
        };
      });
      player.newSquares = [];

    });

  }

  p.drawSquares = function () {
    board.players.forEach(player => {
      if(player.lineToggle == true){
        p.stroke(player.outlineFillstyle);
        p.strokeWeight(2.5);
        p.setLineDash([5, 5]);
        player.squares.forEach(square => {
          if(square.type == 'diamond'){

            p.beginShape();
            p.vertex(square.top_x, square.top_y);
            p.vertex(square.right_x, square.right_y);
            p.vertex(square.bottom_x, square.bottom_y);
            p.vertex(square.left_x, square.left_y);
            p.endShape(p.CLOSE);
          }
          else {
            p.rect(square.origin_x, square.origin_y, square.length, square.length);
          };
        });
      }
      
      });
  }

  p.setLineDash = function(list) {
    p.drawingContext.setLineDash(list);
  }

  p.newParams = function(){
    let size = document.getElementById('boardSizeSelect').value;
    // let numPlayers = document.getElementById('numPlayersSelect').value;
    let players = [];

    for(let i=1; i <playerData.length+1; i++) {
      players[i-1] = new Score(i, playerData[i-1][1], playerData[i-1][0]);
    };

    timer = document.getElementById('timerSelect').value;
    interval = +timer;
    waitingCount=interval;

    p.clear();
    board.reset(+size, players, p);
    board.sounds[2].play();
    board.sounds[3].play();
  }
}

// Get params from session storage
let boardSize = +sessionStorage.getItem("boardSize");
let timerSelect = +sessionStorage.getItem("timer");
let numPlayers = +sessionStorage.getItem("numPlayers");
let playerData = JSON.parse(sessionStorage.getItem("playerData"));

console.log(playerData);
console.log(playerData.length);
console.log("BOARD SIZE: " + sessionStorage.getItem("boardSize").toString(10));
console.log("TIMER: " + sessionStorage.getItem("timer").toString(10));

let players = [];

for(let i=1; i <playerData.length+1; i++) {
  players[i-1] = new Score(i, playerData[i-1][1], playerData[i-1][0]);
};

console.log(players);

var board = new Board(boardSize, players);

var sketch = new p5(sketchBoard, 'boardContainer');



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
      document.getElementById("progressBar").innerHTML = "0";
      document.getElementById("progressBar").style.color="white";
      board.sounds[4].play();
      alert("Ran out of Time!");
      board.updateScore();
      board.nextPlayer();
      waitingCount = interval;

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
