

export class Score {
  constructor(id, color) {
    this.id = id;
    this.currentScore = 0;
    this.currentMultiplier = 1;
    this.multiplierIncrease = 0;
    this.showBoxes = true;
    this.scoreIncrease = 0;
    this.lineToggle = true;
    this.squaresFormed = 0;
    this.squares = [];
    this.diamonds = [];
    this.newSquares = [];
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

  getScoreDisplay(){
    return 'Score: ' + this.currentScore.toString(10) + '  |  +'+ this.scoreIncrease.toString(10);
  }

  getMultiplierDisplay(){
    return 'Multiplier: x'+ this.currentMultiplier.toString(10) + "  |  +(x" + this.multiplierIncrease.toString(10) + ")";
  }
}
