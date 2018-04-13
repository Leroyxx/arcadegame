let sizes = {
  canvasWidth: 505,
  horizontalStep: 101,
  verticalStep: 83,
  enemiesNum: 6,
  enemySpeeds: [150, 94, 70, 50, 100, 210],
  x0E: 1, // enemy starting point on x axis
  y0E: 60, // same for y axis
  x0P: 202,// player starting point on x axis
  y0P: 400 // same for y axis
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = sizes.x0E;
    this.y = sizes.y0E + ( getRandomInt(4) * sizes.verticalStep );
    this.speed = sizes.enemySpeeds[getRandomInt(sizes.enemySpeeds.length)];
    this.sprite = 'images/enemy-bug.png';
    this.height = (function(y){if (y === 60) {return 1} else {
      return ( ( y - sizes.y0E ) / 83 ) + 1
    }})(this.y);
};

Enemy.prototype.reset = function() {
    this.x = sizes.x0E;
    this.y = sizes.y0E + ( getRandomInt(4) * sizes.verticalStep );
    this.speed = sizes.enemySpeeds[getRandomInt(sizes.enemySpeeds.length)];
    this.height = (function(y){if (y === 60) {return 1} else {
      return ( ( y - sizes.y0E ) / 83 ) + 1
    }})(this.y);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * dt);
    if (this.x > sizes.canvasWidth) {
      this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = sizes.x0P;
  this.y = sizes.y0P;
  this.height = 5;
}

// Calling reset on player will put the player back to first square
Player.prototype.reset = function () {
  this.x = sizes.x0P
  this.y = sizes.y0P;
  this.height = 5;
}

Player.prototype.update = function (dt) {

  //precaution against getting out of canvas
  if (this.x >= sizes.canvasWidth) {
    this.x = 404; //4*horizontalStep
  }
  if (this.x <= 0) {
    this.x = 0;
  }
  if (this.y >= sizes.y0P) {
    this.y = sizes.y0P;
  }

}

Player.prototype.render = function (dt) {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  let it = this;
  if (this.y === -15) {
    setTimeout(function(){
      it.x = sizes.x0P;
      it.y = sizes.y0P;
    }, 150)
    //show the player it has reached victory! then respawn it
  }
  if( Enemy.prototype.collision(this.x) ) {
      setTimeout(function(){
        player.reset();
      }, 10)
  }
}

Enemy.prototype.collision = function(playerX) {
  let collided = false;
  allEnemies.forEach(function(enemy) {
    if ( enemy.height === player.height ) {
    if ( playerX <= ( enemy.x + 61 ) &&  playerX >= (enemy.x - 65 ) ) //the enemy has an x range/territory, it shouldn't be identified by 1 point
    {
      collided = true;
    }
  }
  }
)
return collided;
}

Player.prototype.handleInput = function(keyCode) {
  switch (keyCode) {
    case 'left':
      this.x -= sizes.horizontalStep;
      break;
    case 'right':
      this.x += sizes.horizontalStep;
      break;
    case 'up':
      this.y -= sizes.verticalStep;
      break;
    case 'down':
      this.y += sizes.verticalStep;
      break;
    case 'x':
      this.sprite = (function(){
        switch(player.sprite) {
        case 'images/char-boy.png': return 'images/char-horn-girl.png'; break;
        case 'images/char-horn-girl.png': return 'images/char-pink-girl.png'; break;
        case 'images/char-pink-girl.png': return 'images/char-princess-girl.png'; break;
        case 'images/char-princess-girl.png': return 'images/char-cat-girl.png'; break;
        case 'images/char-cat-girl.png': return 'images/char-boy.png'; break;
      }
    })()
  }
  this.height = (function(y){if (y===68) {return 1}
  else {
  return ( ( (y - 68) / 83 ) + 1 )
  }
})(this.y)
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (var i=0; i<sizes.enemiesNum; i++) {
  allEnemies.push(new Enemy());
}
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        88: 'x'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
