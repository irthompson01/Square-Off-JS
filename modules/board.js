import {Tile} from './tile.js';
import {Score} from './score.js';
import {Square} from './square.js';
import {Diamond} from './diamond.js';

export class Board {
  constructor(size=8, num_players=2, canvas) {
    this.size = size;
    this.totalSquares = size*size;
    this.width = size;
    this.height = size;
    this.total_width_px = window.innerWidth*0.4// this.canvas.width;
    this.tile_length_px = this.total_width_px / this.size;

    this.origin_x = 0;
    this.origin_y = 0;

    // this.colors = [['rgba(32,115,148,75)', 'rgba(32,115,148,40)'],
    //                 ['rgba(255, 57, 24, 65)', 'rgba(255, 57, 24, 30)'],
    //                 ['rgba(238, 131, 40, 75)', 'rgba(238, 131, 40, 40)'],
    //                 ['rgba(100, 24, 130, 75)', 'rgba(100, 24, 130, 40)'] ];

    this.colors = [['#16558F', '#0583D2'],
                    ['#D2042D', '#FF3131'],
                    ['#00A000', '#50C878'],
                    ['#000000', '#FEDD00'],
                    ['rgba(100, 24, 130, 75)', '#CF9FFF']];

    this.sounds = [new Audio('./sounds/button.wav'),
                    new Audio('./sounds/Chime.wav'),
                    new Audio('./sounds/bell.mp3'),
                    new Audio('./sounds/fight.mp3'),
                  new Audio('./sounds/fart-01.wav'),
                  new Audio('./sounds/timer2.wav')]

    this.num_players = num_players;

    this.players = [];
    for (var i = 1; i < this.num_players+1; i++) {
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
                              this.grid[i+num][j+num],
                              num+1);
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
                              this.grid[i+num][j+2*num],
                              num+1);
          this.diamonds.push(diamond);
        }
      }
    };



  }

  reset(size, num_players, p) {
    // reset the socre display
    var div = document.getElementById('scoreDisplay');
    div.replaceChildren();

    this.size = size;
    this.num_players = num_players;
    this.totalSquares = size*size;
    this.width = size;
    this.height = size;
    this.total_width_px = window.innerWidth*0.4// this.canvas.width;
    this.tile_length_px = this.total_width_px / this.size;

    this.origin_x = 0;
    this.origin_y = 0;

    this.players = [];
    console.log("reset numPlayers -- ", this.num_players, "reset size -- ", this.size);
    for (var i = 1; i < this.num_players+1; i++) {
      this.players[i-1] = new Score(i, this.colors[i-1])
    };
    this.current_player = this.players[0];

    this.grid = []

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
                              this.grid[i+num][j+num],
                              num+1);
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
                              this.grid[i+num][j+2*num],
                              num+1);
          this.diamonds.push(diamond);
        }
      }
  };

    this.setup(p);
    p.redraw(1);

};

  setup(p){
    var div = document.getElementById('scoreDisplay');
    this.players.forEach(player =>{
      let newDiv = document.createElement('div');
      newDiv.setAttribute("class", "player-div")
      let button = document.createElement('button');
      let button_id = '#b'+player.id;
      button.setAttribute("id", button_id);
      button.setAttribute("class", "line-button");
      // button.innerText = "Lines"
      button.style.backgroundColor = player.fillStyle;
      button.style.height = '50px';
      button.style.width = '50px'
      button.style.borderRadius = '10px'
      button.addEventListener("click", lineToggle, false);
      button.player = player;
      button.color = player.fillStyle;
      button.p = p;
      function lineToggle(evt){
          evt.currentTarget.player.lineToggle = !evt.currentTarget.player.lineToggle;
          if(evt.currentTarget.player.lineToggle == false){

            button.style.backgroundColor = '#DCDCDC'
          }
          else {
            button.style.backgroundColor = evt.currentTarget.color;

          };
          evt.currentTarget.p.redraw();
        }
      newDiv.appendChild(button);
      let elem = document.createElement('h2');
      let elemId = '#p'+player.id;
      elem.setAttribute("id", elemId);
      elem.setAttribute("class", "player")
      elem.innerText = player.getStats();
      if(player.id == 1){
        elem.style.backgroundColor = player.fillStyle;
      }
      else{
        elem.style.backgroundColor = "transparent";
      };
      newDiv.appendChild(elem);
      div.appendChild(newDiv);
    });
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

    let idx_x = Math.floor((ox / this.tile_length_px));
    let idx_y = Math.floor((oy / this.tile_length_px));

    let tile = this.grid[idx_y][idx_x];

    return tile;
  }

  findNewBoxes(){

    this.current_player.scoreIncrease = 0;

    this.squares.forEach(square => {
      if (square.checkOwnership() == true){
        console.log('length: ', square.length,'-size: ', square.size, '-points: ', square.points);
        this.current_player.squaresFormed += 1;
        this.current_player.squares.unshift(square);
        this.current_player.newSquares.unshift(square);

      };
    });

    this.diamonds.forEach(diamond => {
      if (diamond.checkOwnership() == true){
        this.current_player.squaresFormed += 1;
        this.current_player.squares.unshift(diamond);
        this.current_player.newSquares.unshift(diamond);
      };
    });

    if (this.current_player.squaresFormed >= 1){
      this.sounds[1].play();
    }
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
      this.current_player.scoreIncrease += Math.round((this.current_player.getMultiplier()*points));
      this.current_player.addPoints(Math.round(points));
    };

    this.current_player.squaresFormed = 0;

    this.players.forEach(player => {
      let elementId = '#p' + player.id;
      let nextElemId = "#p" + (player.id+1)%this.num_players;
      document.getElementById(elementId).innerText = player.getStats();

      if(player.id == (this.current_player.id%this.num_players+1)){
        document.getElementById(elementId).style.backgroundColor = player.fillStyle;
      }
      else{
        document.getElementById(elementId).style.backgroundColor = "transparent";
      };
    });


  }

  nextPlayer() {
    let idx = this.current_player.id % this.num_players;
    this.current_player = this.players[idx]
  }
};
