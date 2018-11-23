const canvas = document.getElementById('gameFrame');
const context = canvas.getContext('2d');

let x = 20, y = 20, radius = 20;
let dx = 5, dy = 2;

let paddle = {
  width: 70,
  height: 10,
  x: 0,
  y: canvas.height - 10,
  speed: 10,

  isMovingLeft: false,
  isMovingRight: false
};

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    paddle.isMovingLeft = true;
  } else if (event.keyCode === 39) {
    paddle.isMovingRight = true;
  }
});
document.addEventListener('keyup', event => {
  if (event.keyCode === 37) {
    paddle.isMovingLeft = false;
  } else if (event.keyCode === 39) {
    paddle.isMovingRight = false;
  }
})

function drawBall() {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = 'red';
  context.fill();
  context.closePath();
}

function drawPaddle() {
  context.beginPath();
  context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  context.fill()
  context.closePath();
}

function handleBallCollideBounds() {
  if ( x < radius || x > canvas.width - radius )
    dx = -dx;

  if ( y < radius || y > canvas.height - radius )
    dy = -dy;
}

function changeBallPosition() {
  x += dx;
  y += dy;
}

function main() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();

  if (paddle.isMovingLeft)
    paddle.x -= paddle.speed;
  else if (paddle.isMovingRight)
    paddle.x += paddle.speed;

  if (paddle.x < 0)
    paddle.x = 0;
  else if (paddle.x > canvas.width - paddle.width)
    paddle.x = canvas.width - paddle.width;

  handleBallCollideBounds();
  changeBallPosition();

  requestAnimationFrame(main);
}

main();
