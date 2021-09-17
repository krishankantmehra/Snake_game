var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var eaten = false;
var grid = 15;
var count = 0;
var score = 0;
var difficult = 10;

var snake = {
  x: 150,
  y: 150,
  
  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,
  
  // keep track of all grids the snake body occupies
  cells: [],
  
  // length of the snake. grows when eating an apple
  maxCells: 4
};

var apple = {
  x: 300,
  y: 300
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
//  if(eaten === false)
     requestAnimationFrame(loop);

  if(eaten){
    losed();
  }
  // slow game 
  if (++count < difficult) {
    return;
  }
  // score += 100;
  document.getElementById("score").innerHTML = "Your Score:" + score;
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    losed();
  }
  else if (snake.x >= canvas.width) {
    losed();
  }
  
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    losed();
  }
  else if (snake.y >= canvas.height) {
    losed();
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells && eaten === false) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = '#ff0011';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake one cell at a time
  if(eaten === false)context.fillStyle = 'green';
  else context.fillStyle = "gray";
  
  snake.cells.forEach(function(cell, index) {
    
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // canvas is 600*510 which is 40*34 grids 
      apple.x = getRandomInt(0,40) * grid;
      apple.y = getRandomInt(0,34) * grid;
      score += 100;

      if(difficult >= 4)difficult -= 0.5;
      
    }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        
        
        losed();
      }
    }
  });
}
var response = true;
// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)
  
  
  if(response){
    // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
  response = false;
  setTimeout(()=>{response = true},50);
  }

  //Play Again
  if(eaten && e.which === 32){
    history.go(0);
  }
});

let flag = true;
function losed(){
 
  snake.dx = 0;
  snake.dy = 0;
  eaten = true;
  context.clearRect(0,0,canvas.width,canvas.height);

 
   context.fillStyle = "red"
   snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  
   });


  setTimeout(() => {
    canvas.style.display = "none";
    document.getElementById("lose").style.display = "block";
    document.getElementById("replay").style.display = "block";
    
  
  }, 600);
}


// start the game
function show(){
  requestAnimationFrame(loop); 
  document.getElementById("start").style.display = "block";
  document.getElementById("Play").style.display = "none";
  
}