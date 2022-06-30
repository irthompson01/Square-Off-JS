export class Square {
  constructor(topLeft, topRight, bottomLeft, bottomRight){
    this.occupant = -1;
    this.length = topRight.origin_x - topLeft.origin_x;
    this.size = (this.length / topRight.length) + 1;
    this.points = this.size*this.size;
    this.origin_x = topLeft.origin_x + (topLeft.length / 2);
    this.origin_y = topLeft.origin_y + (topLeft.length / 2);
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
    this.newBox = true;
  }

  checkOwnership() {
    if (this.topLeft.occupant == this.topRight.occupant &&
        this.topRight.occupant == this.bottomLeft.occupant &&
        this.bottomLeft.occupant == this.bottomRight.occupant &&
        this.bottomRight.occupant != -1){
          if (this.newBox == true) {
            this.newBox == false;
            return true;
          };
        }
    else {
      return false;
    }
  };


}
