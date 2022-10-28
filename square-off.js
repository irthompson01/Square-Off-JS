
// Import Board Class
import {Board} from './modules/board.js';

// p5.js implementation

function sketchBoard(p) {
  p.setup = function () {
    var cnv = p.createCanvas(window.innerWidth*0.4,window.innerWidth*0.4);

    var startGame = document.getElementById("startButton").addEventListener("click", p.newParams(), false)


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

    var size = document.getElementById('boardSizeSelect').value;
    var numPlayers = document.getElementById('numPlayersSelect').value;

    console.log(size, numPlayers);

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
    // stuff to draw
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
    // p.rect(0, 0, window.innerWidth*0.5,window.innerWidth*0.5);
    // p.rect(window.innerWidth*0.25,window.innerWidth*0.25,  window.innerWidth*0.5,window.innerWidth*0.5);
    // p.rect(0, 0, window.innerWidth*0.25,window.innerWidth*0.25);

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
        // draw new squares
        p.stroke('#FFD700');
        p.strokeWeight(4);
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
      }

      else {
        // pass
      }


    });
  }

  p.mousePressed = function() {
    try {
      var tile = board.getTileClicked(p.mouseX, p.mouseY);
      // console.log("Coordinate x: " + p.mouseX,
      //             "Coordinate y: " + p.mouseY,
      //             "Tile ox: " + tile.origin_x,
      //             "Tile oy: " + tile.origin_y,
      //             tile);

      if (tile.occupant == -1) {
          tile.occupant = board.current_player.id;
          tile.fillColor = board.current_player.fillStyle;

          // Find new squares / diamonds
          board.findNewBoxes();
          // play a sound
          board.updateScore();
          // Move to the next player
          board.nextPlayer();


        }
      p.redraw(1);

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

    console.log("Size: ", size, " -- Players: ", numPlayers);
  }

}

//

function newParams() {
  let size = document.getElementById('boardSizeSelect').value;
  let numPlayers = document.getElementById('numPlayersSelect').value;

  console.log("Size: ", size, " -- Players: ", numPlayers);
}



var board = new Board();

var sketch = new p5(sketchBoard, 'boardContainer');
