import {Tile} from './tile.js';

export class Board {
  constructor(size=8, num_players=2) {
    this.canvas = document.getElementById('canvas01');
    this.context = this.canvas.getContext('2d');

    this.size = size;
    this.width = size;
    this.height = size;
    this.total_width_px = this.canvas.width;
    this.tile_length_px = this.total_width_px / this.size;

    this.origin_x = 0;
    this.origin_y = 0;

    this.num_players = num_players;
    this.grid = [[Tile(this.origin_x + (this.tile_length_px*i), this.origin_y + (this.tile_length_px*j), this.tile_length_px)
                  for i in range(0, this.width)]
                  for i in range(0, this.height)];

  }

  drawGrid(){
    this.context.strokeStyle = 'black';
    this.context.lineWidth = '2';
    this.grid.forEach(row => {
      row.forEach(tile => {
        this.context.strokeRect(tile.origin_x, tile.origin_y, tile.length, tile.length)
      });
    });

  }
};
