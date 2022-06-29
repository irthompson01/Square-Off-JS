

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
    this.boxes = [];
    this.newBoxes = [];
    // this.outline_color = QColor(color[0], color[1], color[2], 127)
    this.fillStyle = color;
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
  }

  getStats(){
    return 'Player: ' + this.id.toString(10) + ' | ' + 'Score: ' + this.currentScore.toString(10) + '  +'+ this.scoreIncrease.toString(10) + ' | ' + 'x'+ this.currentMultiplier.toString(10);
  }
}
