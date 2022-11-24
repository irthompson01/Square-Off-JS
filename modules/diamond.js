export class Diamond {
  constructor(top, left, bottom, right, size){
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
    this.occupant = -1;
    this.top_x = top.origin_x + (top.length / 2);
    this.top_y = top.origin_y + (top.length / 2);
    this.left_x = left.origin_x + (left.length / 2);
    this.left_y = left.origin_y + (left.length / 2);
    this.bottom_x = bottom.origin_x + (bottom.length / 2);
    this.bottom_y = bottom.origin_y + (bottom.length / 2);
    this.right_x = right.origin_x + (right.length / 2);
    this.right_y = right.origin_y + (right.length / 2);

    this.size = size;
    this.points = this.size*this.size*2;
    this.newBox = true;
    this.type = 'diamond';
  }

  checkOwnership(){
    if (this.top.occupant == this.left.occupant &&
        this.left.occupant == this.bottom.occupant &&
        this.bottom.occupant == this.right.occupant &&
        this.right.occupant != this.occupant){

        if (this.newBox == true){
            this.new_box = false;
            this.occupant = this.bottom.occupant;
            return true;
          };
        }

    else{
        return false;
      }
  };

  draw(fillStyle){
    let canvas = document.getElementById('canvas01');
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(this.top_x, this.top_y);
    ctx.lineTo(this.right_x, this.right_y);
    ctx.lineTo(this.bottom_x, this.bottom_y);
    ctx.lineTo(this.left_x, this.left_y);
    ctx.lineTo(this.top_x, this.top_y);
    ctx.closePath();
    ctx.stroke();
  }
}
