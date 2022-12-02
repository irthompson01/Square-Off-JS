

export class Score {
  constructor(id, color) {
    this.id = id;
    this.currentScore = 0;

    this.currentMultiplier = 1;
    this.showBoxes = true;
    this.scoreIncrease = 0;
    this.lineToggle = true;
    // this.line_tile = Tile(950+(105*player_name), 100, 100);
    this.squaresFormed = 0;
    this.squares = [];
    this.diamonds = [];
    this.newSquares = [];
    console.log(color);
    this.outlineFillstyle = color[0];
    this.fillStyle = color[1];
  }

  addPoints(amount) {

    this.currentScore += this.currentMultiplier*amount;

    return this.currentScore;
  }

  incrementMultiplier(amount){
    this.currentMultiplier += amount;
    return this.currentMultiplier;
  }

  resetMultiplier () {
    this.currentMultiplier = 1;
    return this.currentMultiplier;
  }

  getMultiplier(){
    return this.currentMultiplier;
  }

  getStats(){
    return 'Player: ' + this.id.toString(10) + '  |  ' + 'Score: ' + this.currentScore.toString(10) + '  |  +'+ this.scoreIncrease.toString(10) + '  |  ' + 'x'+ this.currentMultiplier.toString(10);
  }
}
