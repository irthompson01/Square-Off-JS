
// Import Board Class
import {Board} from './modules/board.js';


  // Obtain a reference to the canvas element using its id.
let htmlCanvas = document.getElementById('canvas01');
  // Obtain a graphics context on the canvas element for drawing.
let context = htmlCanvas.getContext('2d');

let canvasElem = document.querySelector("canvas");



// Start listening to resize events and draw canvas.

// Register an event listener to call the resizeCanvas() function
// each time the window is resized.
window.addEventListener('resize', resizeCanvas(0.66, 0.8), false);

htmlCanvas.addEventListener("mousedown", function(e) {
            getMousePosition(canvasElem, e);
        });
// Draw canvas border for the first time.
resizeCanvas(0.66, 0.80);

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  console.log("Coordinate x: " + x,
              "Coordinate y: " + y);
}

// Display custom canvas. In this case it's a blue, 5 pixel
// border that resizes along with the browser window.
function redraw(pct_width, pct_height) {
  context.strokeStyle = 'black';
  context.lineWidth = '3';
  context.strokeRect(0, 0, window.innerHeight*(pct_height), window.innerHeight*(pct_height));
  context.strokeRect(0, 0, window.innerHeight*(pct_height)/2, window.innerHeight*(pct_height)/2);
  context.strokeRect(window.innerHeight*(pct_height)/2, window.innerHeight*(pct_height)/2, window.innerHeight*(pct_height), window.innerHeight*(pct_height));
  }

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas(pct_width, pct_height) {
  htmlCanvas.width = window.innerHeight*(pct_height);
  htmlCanvas.height = window.innerHeight*(pct_height);
  redraw(pct_height, pct_height);
  }
