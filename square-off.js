
// Import Board Class
import {Board} from './modules/board.js';

// p5.js implementation

function sketchBoard(p) {
  p.setup = function () {
    var cnv = p.createCanvas(window.innerWidth*0.4,window.innerWidth*0.4);

    var newGame = document.getElementById('startButton');
    newGame.addEventListener('click', p.newParams, false);

    p.background(220, 220, 220);
    p.noLoop();

    var canvas = document.getElementById("boardContainer");
    canvas.style.width = window.innerWidth*0.4 + "px";
    canvas.style.height = window.innerWidth*0.4 + "px";
    var setup = document.getElementById("setupDisplay");
    setup.style.width = window.innerWidth*0.2 + "px";
    setup.style.height = window.innerWidth*0.4 + "px";
    var score = document.getElementById("scoreDisplay"); // ((window.innerHeight*0.75)/window.innerWidth/2) + "%"
    score.style.width = window.innerWidth*0.35 + "px";
    score.style.height = window.innerWidth*0.4 + "px";

    // var size = document.getElementById('boardSizeSelect').value;
    // var numPlayers = document.getElementById('numPlayersSelect').value;

    // draw outline and quadrants
    p.noFill();
    p.strokeWeight(5);
    // p.rect(0, 0, p.width, p.width);
    p.rect(p.width*0.5, p.width*0.5,  p.width, p.width);
    p.rect(0, 0, p.width*0.5, p.width*0.5);


    // draw grid
    board.grid.forEach(row => {
      row.forEach(tile => {
        p.strokeWeight(2);
        p.noFill();
        p.rect(tile.origin_x, tile.origin_y, tile.length, tile.length, 2);
      });
    });

    // setup players
    board.setup(p);

  }

  p.draw = function () {
    // fill in tiles
    board.grid.forEach(row => {
      row.forEach(tile => {
        p.strokeWeight(2);
        p.fill(tile.fillColor);
        p.stroke('#000000');
        p.setLineDash([0, 0]);
        p.rect(tile.origin_x, tile.origin_y, tile.length, tile.length, 5);
      })
    });

    // draw grid outline and quadrants
    p.noFill();
    p.stroke('#000000')
    p.setLineDash([0, 0]);
    p.strokeWeight(5);
    p.rect(0, 0, p.width, p.width, 10, 0, 10, 0);
    p.rect(p.width*0.5, p.width*0.5,  p.width, p.width, 0, 0, 10, 0);
    p.rect(0, 0, p.width*0.5, p.width*0.5, 10, 0, 0, 0);

    // draw squares
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
      
      board.players.forEach(player => {
         // draw new squares
         p.stroke('#FFD700');
         p.strokeWeight(6);
         p.setLineDash([0, 0]);
 
         // Move this outside the for loop to draw new squares last each time.
 
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

  p.mousePressed = function() {
    try {
      if (p.mouseX > 0 && p.mouseY > 0){

        var tile = board.getTileClicked(p.mouseX, p.mouseY);
        // console.log("Coordinate x: " + p.mouseX,
        //             "Coordinate y: " + p.mouseY,
        //             "Tile ox: " + tile.origin_x,
        //             "Tile oy: " + tile.origin_y,
        //             tile);
      }


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

          

        }
    else {
      // play wrong sound
    }

      p.redraw(1);

      // check if all squares are taken
      if (board.totalSquares == 0){
        waitingCount = 1000;
        document.getElementById("progressBar").style.color="white"
        // 1 second delay
        setTimeout(function(){
          console.log("Executed after 1 second");
          board.endGame();
        }, 1000);
        
      }

      else {
        waitingCount = interval;
        document.getElementById("progressBar").style.color="white"
        // Move to the next player
        board.nextPlayer();
      }

    }

    catch(TypeError){
      console.log("Clicked outside the grid yo")
    }
  }

  p.setLineDash = function(list) {
    p.drawingContext.setLineDash(list);
  }

  p.newParams = function(){
    let size = document.getElementById('boardSizeSelect').value;
    let numPlayers = document.getElementById('numPlayersSelect').value;
    timer = document.getElementById('timerSelect').value;
    interval = +timer;
    waitingCount=interval;
    console.log("Size: ", size, " -- Players: ", numPlayers);
    document.getElementById("progressBar").style.color="white";

    // p.remove();
    p.clear();
    board.reset(+size, +numPlayers, p);
    board.sounds[2].play();
    board.sounds[3].play();

  }


}

var board = new Board();

var sketch = new p5(sketchBoard, 'boardContainer');
var timer = document.getElementById('timerSelect').value;
var interval = +timer;
var waitingCount=interval; //Initialize counter
var progressBarId = setInterval(displayProgress ,1000);

function displayProgress() {
  if (waitingCount != 1000) {
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
    document.getElementById("progressBar").innerHTML = "";
    document.getElementById("progressBar").style.backgroundColor = "transparent";
  }
}
