import {Tile} from './tile.js';
import {Score} from './score.js';
import {Square} from './square.js';
import {Diamond} from './diamond.js';

export class Board {
  constructor(size=8, num_players=2, canvas) {
    this.canvas = document.getElementById('canvas01');
    this.context = this.canvas.getContext('2d');

    this.size = size;
    this.width = size;
    this.height = size;
    this.total_width_px = this.canvas.width;
    this.tile_length_px = this.total_width_px / this.size;

    this.origin_x = 0;
    this.origin_y = 0;

    this.colors = ['rgba(32,115,148,85)','rgba(255, 57, 24, 80)','rgba(238, 131, 40, 85)','rgba(100, 24, 130, 85)'];
    this.num_players = num_players;
    this.players = [];
    for (var i = 1; i < this.num_players + 1; i++) {
      this.players[i-1] = new Score(i, this.colors[i-1])
    };
    this.current_player = this.players[0];

    this.grid = [...Array(this.size)].map(e => Array(this.size));
    // Set grid
    for (var i = 0; i < this.width; i++){
      for (var j = 0; j < this.height; j++){
        this.grid[i][j] = new Tile(this.origin_x + (this.tile_length_px*j),
                                  this.origin_y + (this.tile_length_px*i),
                                  this.tile_length_px)
      }
    };

    this.squares = [];
    // Set Square objects made from grid tiles
    for (var num = 1; num < this.width; num++) {
      for (var j = 0; j < this.height - num; j++){
        for (var i = 0; i < this.width - num; i++){
          var square = new Square(this.grid[i][j],
                              this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+num][j+num]);
          this.squares.push(square);
        }
      }
    };

    this.diamonds = [];

    for (var num = 1; num < Math.floor(this.width / 2); num++) {
      for (var j = 0; j < this.height - 2*num; j++){
        for (var i = 0; i < this.width - 2*num; i++){
          var diamond = new Diamond(this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+2*num][j+num],
                              this.grid[i+num][j+2*num]);
          this.diamonds.push(diamond);
        }
      }
    };



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
    let ox = mpx - ((mpx - this.origin_x) % this.tile_length_px);
    let oy = mpy - ((mpy - this.origin_y) % this.tile_length_px);

    let idx_x = Math.floor((ox / this.tile_length_px));  // - (this.origin_x//this.tile_length_px))
    let idx_y = Math.floor((oy / this.tile_length_px));  // - (this.origin_x//this.tile_length_px))
    //console.log("Tile[" + idx_y + "]" + "[" + idx_x + "]")
    let tile = this.grid[idx_y][idx_x];

    return tile;
  }

  findNewBoxes(){

    this.current_player.scoreIncrease = 0;

    this.squares.forEach(square => {
      if (square.checkOwnership() == true){
        this.current_player.squaresFormed += 1;
        this.current_player.squares.unshift(square);
        this.current_player.newSquares.unshift(square);

      };
    });

    this.diamonds.forEach(diamond => {
      if (diamond.checkOwnership() == true){
        this.current_player.squaresFormed += 1;
        this.current_player.squares.unshift(square);
        this.current_player.newSquares.unshift(square);

      };
    });
  };

  updateScore(){
    let mult = this.current_player.squaresFormed;

    // Reset or Increase muliplier
    if (mult <= 1){
      this.current_player.resetMultiplier();
    }
    else {
      this.current_player.incrementMultiplier(mult-1);
    };

    for (var i = 0; i < mult; i++) {
      let points = this.current_player.squares[i].points;
      this.current_player.scoreIncrease += (this.current_player.getMultiplier()*points);
      this.current_player.addPoints(points);
    };

    this.current_player.squaresFormed = 0;

    this.players.forEach(player => {
      console.log(player.getStats(), player.squares);
      player.squares.forEach(square => {
        console.log(square);
      })

    });


  }

  nextPlayer() {
    let idx = this.current_player.id % this.num_players;
    this.current_player = this.players[idx]
  }
};
