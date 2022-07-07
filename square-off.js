
// Import Board Class
import {Board} from './modules/board.js';

// https://p5js.org/get-started/#settingUp
  // Obtain a reference to the canvas element using its id.
// let htmlCanvas = document.getElementById('canvas01');
//   // Obtain a graphics context on the canvas element for drawing.
// var context = htmlCanvas.getContext('2d');
//
// let canvasElem = document.querySelector("canvas");
// // Start listening to resize events and draw canvas.
//
// // Register an event listener to call the resizeCanvas() function
// // each time the window is resized.
// window.addEventListener('resize', resizeCanvas(0.66, 0.8), false);
//
// // Draw canvas border for the first time.
// resizeCanvas(0.66, 0.80);
// // Display custom canvas. In diamond case it's a blue, 5 pixel
// // border that resizes along with the browser window.
// function redraw(pct_width, pct_height) {
//   context.strokeStyle = 'black';
//   context.lineWidth = '3';
//   context.strokeRect(0, 0, window.innerHeight*(pct_height), window.innerHeight*(pct_height));
// }
// // Runs each time the DOM window resize event fires. Resets the canvas dimensions to match window,
// // then draws the new borders accordingly.
// function resizeCanvas(pct_width, pct_height) {
//   htmlCanvas.width = window.innerHeight*(pct_height);
//   htmlCanvas.height = window.innerHeight*(pct_height);
//   redraw(pct_height, pct_height);
//   }


// Initialize the game board

// p5.js implementation

function sketchBoard(p) {
  p.setup = function () {
    p.createCanvas(window.innerWidth*0.4,window.innerWidth*0.4);
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



    // draw outline and quadrants
    p.noFill();
    p.strokeWeight(5);
    p.rect(0, 0, p.width, p.width);
    p.rect(p.width*0.5, p.width*0.5,  p.width, p.width);
    p.rect(0, 0, p.width*0.5, p.width*0.5);
    // p.rect(0, 0, window.innerWidth*0.5,window.innerWidth*0.5);
    // p.rect(window.innerWidth*0.25,window.innerWidth*0.25,  window.innerWidth*0.5,window.innerWidth*0.5);
    // p.rect(0, 0, window.innerWidth*0.25,window.innerWidth*0.25);

    // draw grid
    board.grid.forEach(row => {
      row.forEach(tile => {
        p.strokeWeight(2);
        p.noFill();
        p.rect(tile.origin_x, tile.origin_y, tile.length, tile.length);
      });
    });

    // setup players
    board.setup();

  }

  p.draw = function () {
    // stuff to draw
    board.grid.forEach(row => {
      row.forEach(tile => {
        p.strokeWeight(2);
        p.fill(tile.fillColor);
        p.stroke('#000000');
        p.setLineDash([0, 0]);
        p.rect(tile.origin_x, tile.origin_y, tile.length, tile.length);
      })
    });

    // draw grid outline and quadrants
    p.noFill();
    p.stroke('#000000')
    p.setLineDash([0, 0]);
    p.strokeWeight(5);
    p.rect(0, 0, p.width, p.width);
    p.rect(p.width*0.5, p.width*0.5,  p.width, p.width);
    p.rect(0, 0, p.width*0.5, p.width*0.5);
    // p.rect(0, 0, window.innerWidth*0.5,window.innerWidth*0.5);
    // p.rect(window.innerWidth*0.25,window.innerWidth*0.25,  window.innerWidth*0.5,window.innerWidth*0.5);
    // p.rect(0, 0, window.innerWidth*0.25,window.innerWidth*0.25);

    // draw squares
    board.players.forEach(player => {
      p.stroke(player.outlineFillstyle);
      p.strokeWeight(2);
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

  p.setLineDash = function(list) {
    p.drawingContext.setLineDash(list);
  }

}

var board = new Board();

new p5(sketchBoard, 'boardContainer');



// var board = new Board();


// //
// board.drawGrid();
//
// board.drawQuadrants();
//
// board.setup();
//
// // Create mousedown listener
// htmlCanvas.addEventListener("click", function(e) {
//             getCanvasPosition(canvasElem, e);
//         });
//
// // Mouse press event on the canvas
// // Game logic
// function getCanvasPosition(canvas, event) {
//   let rect = canvas.getBoundingClientRect();
//   let x = event.clientX - rect.left;
//   let y = event.clientY - rect.top;
//
//   var tile = board.getTileClicked(x, y);
//   // console.log("Coordinate x: " + x,
//   //             "Coordinate y: " + y,
//   //             "Tile ox: " + tile.origin_x,
//   //             "Tile oy: " + tile.origin_y,
//   //             tile);
//
//   // If the tile is unoccupied, set occupant and update squares formed, diamonds formed and score
//   if (tile.occupant == -1) {
//     tile.occupant = board.current_player.id;
//     context.fillStyle = board.current_player.fillStyle;
//     context.fillRect(tile.origin_x+0.75, tile.origin_y+0.75, tile.length-1.5, tile.length-1.5);
//     board.drawQuadrants();
//
//     // Find and Draw New squares / diamonds
//     board.findNewBoxes();
//
//     // play a sound
//     board.updateScore();
//
//     // Move to the next player
//     board.nextPlayer();
//   }
//
// }
