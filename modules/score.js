

export class Score {
  constructor(id, color) {
    this.id = id;
    this.current_score = 0;

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
}
