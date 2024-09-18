import {Tile} from '../shared/tile.js';
import {Square} from '../shared/square.js';
import {Diamond} from '../shared/diamond.js';

export class Board {
  constructor(size=8, players, canvas) {
    this.size = size;
    this.totalSquares = size*size;
    this.width = size;
    this.height = size;
    this.total_width_px = window.innerHeight*0.98;
    this.tile_length_px = this.total_width_px / this.size;
    this.space = 4;
    this.rotationAngle = 360;
    this.rotationSpeed = 5;
    this.p = canvas;
    this.origin_x = 0;
    this.origin_y = 0;

    this.sounds = [new Audio('/sounds/button.wav'),
                    new Audio('/sounds/Chime.wav'),
                    new Audio('/sounds/bell.mp3'),
                    new Audio('/sounds/fight.mp3'),
                  new Audio('/sounds/fart-01.wav'),
                  new Audio('/sounds/timer2.wav')]
    
    // Initialize players
    this.num_players = players.length;
    this.players = players;
    this.current_player = this.players[0];
    // Initialize grid
    this.tileSprites = new this.p.Group();
    this.grid = this.createGrid(size);
    // Initialize squares
    this.squareSprites = new this.p.Group();
    this.squares = this.createSquares();
    // Initialize diamonds
    this.diamondSprites = new this.p.Group();
    this.diamonds = this.createDiamonds();
  }

  reset(size, players, p) {
    // reset the socre display
    var div = document.getElementById('scoreDisplay');
    div.replaceChildren();

    this.size = size;
    this.num_players = players.length;
    this.totalSquares = size*size;
    this.width = size;
    this.height = size;
    this.total_width_px = window.innerHeight*0.98
    this.tile_length_px = this.total_width_px / this.size;
    this.origin_x = 0;
    this.origin_y = 0;

    // Initialize players
    this.players = players;
    this.current_player = this.players[0];
    // Initialize grid
    this.tileSprites.remove();
    this.tileSprites = new this.p.Group();
    this.grid = this.createGrid(size);
    // Initialize squares
    this.squareSprites.remove();
    this.squareSprites = new this.p.Group();
    this.squares = this.createSquares();
    // Initialize diamonds
    this.diamondSprites.remove();
    this.diamondSprites = new this.p.Group();
    this.diamonds = this.createDiamonds();
};

  getTileClicked(mpx, mpy){
    let ox = mpx - (mpx % this.tile_length_px)+1;
    let oy = mpy - (mpy % this.tile_length_px)+1;

    let idx_x = Math.floor((ox / this.tile_length_px));
    let idx_y = Math.floor((oy / this.tile_length_px));

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

        square.topLeft.sprite.rotate(this.rotationAngle, this.rotationSpeed);
        square.topRight.sprite.rotate(this.rotationAngle, this.rotationSpeed);
        square.bottomLeft.sprite.rotate(this.rotationAngle, this.rotationSpeed);
        square.bottomRight.sprite.rotate(this.rotationAngle, this.rotationSpeed);

        let s = new this.squareSprites.Sprite(square.topLeft.origin_x+  this.tile_length_px*square.size/2,
                                            square.topLeft.origin_y+  this.tile_length_px*square.size/2, 
                            [this.tile_length_px*(square.size-1), -90, 4]);

        s.shape = 'chain';
        s.visible = true;
        s.color = this.current_player.outlineFillstyle;
        s.layer = 2;

        this.current_player.sprites.add(s);

      };
    });

    this.diamonds.forEach(diamond => {
      if (diamond.checkOwnership() == true){
        this.current_player.squaresFormed += 1;
        this.current_player.squares.unshift(diamond);
        this.current_player.newSquares.unshift(diamond);

        diamond.top.sprite.rotate(this.rotationAngle, this.rotationSpeed);
        diamond.bottom.sprite.rotate(this.rotationAngle, this.rotationSpeed);
        diamond.left.sprite.rotate(this.rotationAngle, this.rotationSpeed);
        diamond.right.sprite.rotate(this.rotationAngle, this.rotationSpeed);

        let d = new this.squareSprites.Sprite(diamond.top.origin_x +  this.tile_length_px/2,
                                            diamond.top.origin_y +  this.tile_length_px*(diamond.size-1) +  this.tile_length_px/2, 
                            [this.tile_length_px*Math.sqrt(2)*(diamond.size-1), -90, 4]);

        d.shape = 'chain';
        d.visible = true;
        d.color = this.current_player.outlineFillstyle;
        d.rotation = 45;
        d.layer = 2;

        this.current_player.sprites.add(d);

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
      this.current_player.multiplierIncrease = 0;
    }
    else {
      this.current_player.incrementMultiplier(mult-1);
      this.current_player.multiplierIncrease = (mult-1);
    };

    for (var i = 0; i < mult; i++) {
      let points = this.current_player.squares[i].points;
      this.current_player.scoreIncrease += Math.round((this.current_player.getMultiplier()*points));
      this.current_player.addPoints(Math.round(points));
    };

    this.current_player.squaresFormed = 0;

    this.players.forEach(player => {
      let playerNameId = "playerName" + player.id;
      let playerDivId = 'player'+player.id + "div";

      let scoreDisplayId = "scoreDisplay" + player.id;
      document.getElementById(scoreDisplayId).innerText = player.getScoreDisplay();

      let multDisplayId = "multDisplay" + player.id;
      document.getElementById(multDisplayId).innerText = player.getMultiplierDisplay();

      if(player.id == (this.current_player.id%this.num_players+1)){
        document.getElementById(playerDivId).style.backgroundColor = player.fillStyle;
        document.getElementById(playerNameId).style.color = "#ffffff";
        document.getElementById(scoreDisplayId).style.color = "#ffffff";
        document.getElementById(multDisplayId).style.color = "#ffffff";

      }
      else{
        document.getElementById(playerDivId).style.backgroundColor = "#dcdcdc";
        document.getElementById(playerNameId).style.color = "#000000";
        document.getElementById(scoreDisplayId).style.color = "#000000";
        document.getElementById(multDisplayId).style.color = "#000000";
      };
    });




  }

  nextPlayer() {
    let idx = this.current_player.id % this.num_players;
    this.current_player = this.players[idx]
  }

  endGame(){
    let currentWinner = this.getCurrentWinner();
    alert(currentWinner.name + " wins!\n" + currentWinner.getStats());
  }

  getCurrentWinner(){
    let maxValue = Number.MIN_VALUE;
    let currentWinner;

    for(var i=0;i<this.players.length;i++){
        if(this.players[i].currentScore>maxValue){
        maxValue = this.players[i].currentScore;
        currentWinner = this.players[i];
       }
    }
    return currentWinner;
  }

  createGrid(size){

    let grid = [...Array(size)].map(e => Array(size));

    for (var i = 0; i < this.width; i++){
      for (var j = 0; j < this.height; j++){
        let sprite = new this.tileSprites.Sprite();
        sprite.width = this.tile_length_px-2*this.space;
        sprite.height = this.tile_length_px-2*this.space;
        sprite.x = this.tile_length_px*j + this.tile_length_px/2 ;
        sprite.y = this.tile_length_px*i + this.tile_length_px/2 ;
        sprite.color = "#dcdcdc";
        sprite.layer = 0;
        sprite.removeColliders();

        grid[i][j] = new Tile(this.origin_x + (this.tile_length_px*j),
                                  this.origin_y + (this.tile_length_px*i),
                                  this.tile_length_px, i, j,
                                  sprite)
      }
    };

    return grid;
  }

  createSquares(){
    let squares = [];
    // Set Square objects made from grid tiles
    for (var num = 1; num < this.width; num++) {
      for (var j = 0; j < this.height - num; j++){
        for (var i = 0; i < this.width - num; i++){
          var square = new Square(this.grid[i][j],
                              this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+num][j+num],
                              num+1);

          squares.push(square);
        }
      }
    };
    return squares;
  }

  createDiamonds(){
    let diamonds = [];
    // Set Diamond objects made from grid tiles
    for (var num = 1; num < Math.ceil(this.width / 2); num++) {
      for (var j = 0; j < this.height - 2*num; j++){
        for (var i = 0; i < this.width - 2*num; i++){
          var diamond = new Diamond(this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+2*num][j+num],
                              this.grid[i+num][j+2*num],
                              num+1);
          diamonds.push(diamond);
          }
        }
    };
    return diamonds;
  }
};
