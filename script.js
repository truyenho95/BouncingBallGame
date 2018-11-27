const canvas = document.getElementById('gameFrame');
const context = canvas.getContext('2d');

function Ball(x, y, radius, dx, dy, paddle) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.dx = dx;
  this.dy = dy;
  this.touchTheRight = false;
  this.touchTheLeft = false;
  this.touchTheTop = false;

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
      this.touchTheTop = false;
    }
    else if ( this.x > canvas.width - this.radius ) {
      this.dx = -this.dx;
      this.touchTheLeft = false;
      this.touchTheRight = true;
      this.touchTheTop = false;
    }
  
    if ( this.y < this.radius ) {
      this.dy = -this.dy;
      this.touchTheLeft = false;
      this.touchTheRight = false;
      this.touchTheTop = true;
    }
  }
  this.increaseXandY = () => {
    this.dx+=1;
    this.dy+=1;
    if (this.dx*this.dy === 0) {
      this.dx+=1;
      this.dy+=1;
    }
  }
  this.decreaseXandY = () => {
    this.dx-=1;
    this.dy-=1;
    if (this.dx*this.dy === 0) {
      this.dx-=1;
      this.dy-=1;
    }
  }
  this.increaseXandDecreaseY = () => {
    this.dx+=1;
    this.dy-=1;
    if (this.dx*this.dy === 0) {
      this.dx+=1;
      this.dy-=1;
    }
  }
  this.decreaseXandIncreaseY = () => {
    this.dx-=1;
    this.dy+=1;
    if (this.dx*this.dy === 0) {
      this.dx-=1;
      this.dy+=1;
    }
  }
  this.handleBallCollidePaddle = () => {
    if ((this.x + this.radius >= paddle.x) && (this.x + this.radius <= paddle.x + paddle.width) && (this.y + this.radius >= paddle.y) && (this.y <= paddle.y)) {
      console.log(`${this.dx},${this.dy}`);
      this.y = paddle.y - this.radius;
      if (paddle.isMovingLeft && this.touchTheLeft) {
        this.decreaseXandY();
        console.log(`${this.dx},${this.dy}`);
      } else if (paddle.isMovingRight && this.touchTheRight) {
        this.increaseXandDecreaseY();
        console.log(`${this.dx},${this.dy}`);
      } else if (paddle.isMovingRight && this.touchTheLeft) {
        this.increaseXandY();
        console.log(`${this.dx},${this.dy}`);
      } else if (paddle.isMovingLeft && this.touchTheRight) {
        this.decreaseXandIncreaseY();
        console.log(`${this.dx},${this.dy}`);
      } else if (paddle.isMovingLeft && this.touchTheTop) {
        this.decreaseXandIncreaseY();
        console.log(`${this.dx},${this.dy}`);
      } else if (paddle.isMovingRight && this.touchTheTop) {
        this.increaseXandY();
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

function Game(ball, paddle) {
  this.isGameOver = false;
  this.score = 0;

  this.addEvent = () => {
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
  }
  this.checkGameOver = () => {
    if (ball.y > canvas.height - ball.radius) {
      return this.isGameOver = true;
    }
  }
  this.drawResult = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    context.closePath();

    context.beginPath();
    context.font = "20px Arial";
    context.textAlign = "center";
    context.fillText(`Your score: ${this.score}`, canvas.width/2, canvas.height/2+30);
    context.closePath();
  }
  this.countUp = () => {
    const timerSelector = document.getElementById('timer');
    const scoreSelector = document.getElementById('score');
    let second = 0;
    let countUp = setInterval(() => {
      ++second;
      timerSelector.innerHTML = second + 's';
      if (second%5===0) {
        scoreSelector.innerHTML = second/5;
        this.score = second/5;
      }
      if (this.checkGameOver()) {
        clearInterval(countUp);
      }
    }, 1000);
  }
  this.play = () => {
    this.addEvent();
    
    if (!this.isGameOver) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      ball.drawBall();
      paddle.drawPaddle();

      ball.handleBallCollideBounds();
      ball.handleBallCollidePaddle();

      ball.changeBallPosition();
      paddle.changePaddlePosition();

      this.checkGameOver();
      requestAnimationFrame(this.play);
    } else {
      this.drawResult();
      console.log('GAME OVER!');
    }
  }
  this.reset = () => {
    location.reload();
  }
}

const myPaddle = new Paddle(80, 10, 0, canvas.height-10-50, 10);
const myBall = new Ball(canvas.width/2, 15, 15, 6, 3, myPaddle);
const playGame = new Game(myBall, myPaddle);

playGame.play();
playGame.countUp();
document.getElementById('reset').addEventListener('click', () => {
  playGame.reset();
})