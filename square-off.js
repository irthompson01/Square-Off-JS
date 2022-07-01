
// Import Board Class
import {Board} from './modules/board.js';



  // Obtain a reference to the canvas element using its id.
let htmlCanvas = document.getElementById('canvas01');
  // Obtain a graphics context on the canvas element for drawing.
var context = htmlCanvas.getContext('2d');

let canvasElem = document.querySelector("canvas");


// Start listening to resize events and draw canvas.

// Register an event listener to call the resizeCanvas() function
// each time the window is resized.
window.addEventListener('resize', resizeCanvas(0.66, 0.8), false);


// Draw canvas border for the first time.
resizeCanvas(0.66, 0.80);
// Display custom canvas. In this case it's a blue, 5 pixel
// border that resizes along with the browser window.
function redraw(pct_width, pct_height) {
  context.strokeStyle = 'black';
  context.lineWidth = '3';
  context.strokeRect(0, 0, window.innerHeight*(pct_height), window.innerHeight*(pct_height));
}
// Runs each time the DOM window resize event fires. Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas(pct_width, pct_height) {
  htmlCanvas.width = window.innerHeight*(pct_height);
  htmlCanvas.height = window.innerHeight*(pct_height);
  redraw(pct_height, pct_height);
  }


// Initialize the game board
var board = new Board();

board.drawGrid();

board.drawQuadrants();

board.setup();

// Create mousedown listener
htmlCanvas.addEventListener("click", function(e) {
            getCanvasPosition(canvasElem, e);
        });

// Mouse press event on the canvas
// Game logic
function getCanvasPosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  var tile = board.getTileClicked(x, y);
  // console.log("Coordinate x: " + x,
  //             "Coordinate y: " + y,
  //             "Tile ox: " + tile.origin_x,
  //             "Tile oy: " + tile.origin_y,
  //             tile);

  // If the tile is unoccupied, set occupant and update squares formed, diamonds formed and score
  if (tile.occupant == -1) {
    tile.occupant = board.current_player.id;
    context.fillStyle = board.current_player.fillStyle;
    context.fillRect(tile.origin_x+0.75, tile.origin_y+0.75, tile.length-1.5, tile.length-1.5);
    board.drawQuadrants();

    // Find and Draw New squares / diamonds
    board.findNewBoxes();

    // play a sound
    board.updateScore();

    // Move to the next player
    board.nextPlayer();
  }

}
