export class Tile {
  constructor(origin_x, origin_y, length, index_x, index_y, sprite = null) {
    this.origin_x = origin_x;
    this.origin_y = origin_y;
    this.length = length;
    this.occupant = -1;
    this.fillColor = "#DCDCDC";
    this.index_x = index_x;
    this.index_y = index_y;
    this.sprite = sprite;
  }
}
