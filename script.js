const canvas = document.getElementById('gameFrame');
const context = canvas.getContext('2d');

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    myPaddle.isMovingLeft = true;
  } else if (event.keyCode === 39) {
    myPaddle.isMovingRight = true;
  }
});
document.addEventListener('keyup', event => {
  if (event.keyCode === 37) {
    myPaddle.isMovingLeft = false;
  } else if (event.keyCode === 39) {
    myPaddle.isMovingRight = false;
  }
})

let isGameOver = false;

function Ball(x, y, radius, dx, dy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.dx = dx;
  this.dy = dy;
  this.touchTheRight = false;
  this.touchTheLeft = false;

  this.drawBall = () => {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
  }
  this.handleBallCollideBounds = () => {
    if ( this.x < this.radius) {
      this.dx = -this.dx;
      this.touchTheLeft = true;
      this.touchTheRight = false;
    }
    else if ( this.x > canvas.width - this.radius ) {
      this.dx = -this.dx;
      this.touchTheLeft = false;
      this.touchTheRight = true;
    }
  
    if ( this.y < this.radius )
      this.dy = -this.dy;
  }
  this.handleBallCollidePaddle = () => {
    if ((this.x + this.radius >= myPaddle.x) && (this.x + this.radius <= myPaddle.x + myPaddle.width) && (this.y + this.radius >= canvas.height - myPaddle.height)) {
      console.log(`${this.dx},${this.dy}`);
      // console.log(myPaddle.isMovingLeft && this.dx>0 && this.dy>0);
      // console.log(myPaddle.isMovingRight && this.dx<0 && this.dy>0);
      // console.log(myPaddle.isMovingRight && this.dx>0 && this.dy>0);
      // console.log(myPaddle.isMovingLeft && this.dx<0 && this.dy>0);
      if (myPaddle.isMovingLeft && this.touchTheLeft && this.dx*this.dy !==0) {
        this.dx-=1;
        this.dy-=1;
        console.log(`${this.dx},${this.dy}`);
      } else if (myPaddle.isMovingRight && this.touchTheRight && this.dx*this.dy !==0) {
        this.dx-=1;
        this.dy-=1;
        console.log(`${this.dx},${this.dy}`);
      } else if (myPaddle.isMovingRight && this.touchTheLeft && this.dx*this.dy !==0) {
        this.dx+=1;
        this.dy+=1;
        console.log(`${this.dx},${this.dy}`);
      } else if (myPaddle.isMovingLeft && this.touchTheRight && this.dx*this.dy !==0) {
        this.dx+=1;
        this.dy+=1;
        console.log(`${this.dx},${this.dy}`);
      } else if (this.dx*this.dy === 0) {
        this.dx+=1;
        this.dy+=1;
        console.log(`${this.dx},${this.dy}`);
      }

      this.dy = -this.dy;
    }
  }
  this.changeBallPosition = () => {
    this.x += this.dx;
    this.y += this.dy;
  }
}

function Paddle(width, height, x, y, speed) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.isMovingLeft = false;
  this.isMovingRight = false;

  this.drawPaddle = () => {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fill()
    context.closePath();
  }
  this.changePaddlePosition = () => {
    if (myPaddle.isMovingLeft)
      this.x -= this.speed;
    else if (this.isMovingRight)
      this.x += this.speed;
  
    if (this.x < 0)
      this.x = 0;
    else if (this.x > canvas.width - this.width)
      this.x = canvas.width - this.width;
  }
}

const myBall = new Ball(20, 20, 20, 5, 2);
const myPaddle = new Paddle(80, 10, 0, canvas.height-10, 10);

function checkGameOver() {
  if (myBall.y > canvas.height - myBall.radius) {
    isGameOver = true;
  }
}

function main() {
  if (!isGameOver) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    myBall.drawBall();
    myPaddle.drawPaddle();

    myBall.handleBallCollideBounds();
    myBall.handleBallCollidePaddle();

    myBall.changeBallPosition();
    myPaddle.changePaddlePosition();

    checkGameOver();
    requestAnimationFrame(main);
  } else {
    console.log('GAME OVER!');
  }
}

main();
