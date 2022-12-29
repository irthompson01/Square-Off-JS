export class Tile {
  constructor(origin_x, origin_y, length, sprite=null){
    this.origin_x = origin_x;
    this.origin_y = origin_y;
    this.length = length;
    this.occupant = -1;
    this.fillColor = '#DCDCDC';
    this.sprite = sprite;

  }
};
