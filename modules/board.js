import {Tile} from './tile.js';
import {Score} from './score.js';
import {Square} from './square.js';
import {Diamond} from './diamond.js';

export class Board {
  constructor(size=10, num_players=2, canvas) {
    this.canvas = document.getElementById('canvas01');
    this.context = this.canvas.getContext('2d');

    this.size = size;
    this.width = size;
    this.height = size;
    this.total_width_px = this.canvas.width;
    this.tile_length_px = this.total_width_px / this.size;

    this.origin_x = 0;
    this.origin_y = 0;
    this.colors = ["blue", "red", "green", "yellow"]
    this.num_players = num_players;
    this.players = [];
    for (var i = 1; i < this.num_players + 1; i++) {
      this.players[i-1] = new Score(i, this.colors[i-1])
    };
    this.current_player = this.players[0];

    this.grid = [...Array(this.size)].map(e => Array(this.size));
    for (var i = 0; i < this.width; i++){
      for (var j = 0; j < this.height; j++){
        this.grid[i][j] = new Tile(this.origin_x + (this.tile_length_px*j),
                                  this.origin_y + (this.tile_length_px*i),
                                  this.tile_length_px)
      }
    }
  }

  drawGrid(){
    var canvas = document.getElementById('canvas01');
    var context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    context.lineWidth = '1';
    this.grid.forEach(row => {
      row.forEach(tile => {
        context.strokeRect(tile.origin_x, tile.origin_y, tile.length, tile.length)
      });
    });

  }

  drawQuadrants() {
    var canvas = document.getElementById('canvas01');
    var context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    context.lineWidth = '3';
    context.strokeRect(0, 0, canvas.width/2, canvas.height/2);
    context.strokeRect(canvas.width/2, canvas.height/2, canvas.width, canvas.height);

  }

  getTileClicked(mpx, mpy){
    var ox = mpx - ((mpx - this.origin_x) % this.tile_length_px);
    var oy = mpy - ((mpy - this.origin_y) % this.tile_length_px);

    var idx_x = Math.floor((ox / this.tile_length_px));  // - (this.origin_x//this.tile_length_px))
    var idx_y = Math.floor((oy / this.tile_length_px));  // - (this.origin_x//this.tile_length_px))
    console.log("Tile[" + idx_y + "]" + "[" + idx_x + "]")
    var tile = this.grid[idx_y][idx_x];

    return tile;
  }

  nextPlayer() {
    const idx = this.current_player.id % this.num_players;
    this.current_player = this.players[idx]
  }
};
