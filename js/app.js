let sizes = {
  canvasWidth: 505,
  horizontalStep: 101,
  verticalStep: 83,
  enemiesNum: 6,
  jewelsNum: getRandomInt(6),
  rocksNum: getRandomInt(4),
  enemySpeeds: [150, 94, 70, 50, 100, 210],
  x0E: 1, // enemy starting point on x axis
  y0E: 60, // same for y axis
  x0P: 202,// player starting point on x axis
  y0P: 400, // same for y axis
  usedSpots: [],
  getRandomSpot: function(axis, obj) {
    let step = getRandomInt(5);
    let xVal = step*sizes.horizontalStep;
    if (axis === "x") {
      return xVal;
    }
    else if (axis === "y" && obj) {
      let yVal;

      function calcY() {
        step = getRandomInt(5);
        xVal = step*sizes.horizontalStep;
        if (step === 0) {yVal = 48;} else if (step == 4) {yVal = sizes.verticalStep * 3 + 48;} else {yVal = sizes.verticalStep * step + 48; }
      }

      function setY() {
        calcY();
        if (sizes.usedSpots[0]) {
        for (let spot of sizes.usedSpots) {
            let spotXVal = spot["x"];
            let spotYVal = spot["y"];
            if (obj.x === spotXVal && yVal === spotYVal) {
                // xVal is a new x value, obj.x is the x value that's assigned
                // spotXVal and spotYVal are the written values we don't want repeating together
                // yVal is the y value to get potentially assigned
                // change the y and x of the object in order to...
                obj.x=xVal;
                setY(); break; } //prevent two gems/other future objects from landing on the same spot else
        }
      }}
      setY();
      sizes.usedSpots.push({"x": obj.x, "y": yVal});
      return yVal;
    }
  }
}
let obtained = {
  jewels: 0
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var Counter = function(type) {
  this.type = type;
  this.x;
  this.y;
  this.value;
  if (this.type === "jewel") {
    this.value = obtained.jewels;
    this.x = 80;
    this.y = 40;
  }
  //DESIGN RELATED:
  this.widthOfText;
}

Counter.prototype.update = function() {
  if (this.type === "jewel") {
    this.value = obtained.jewels;
  }
  this.widthOfText = ctx.measureText(this.text);
}

Counter.prototype.render = function() {
  ctx.font = '36px Tahoma';
  ctx.strokeText(this.value, this.x, this.y);
  this.widthOfText = ctx.measureText(this.value).width;
  if (this.type === "jewel") {
    ctx.font = '21px Tahoma';
    ctx.fillText('points', this.x+this.widthOfText+5, this.y);
  }
}

var Jewel = function() {
  this.x = sizes.getRandomSpot("x");
  this.y = sizes.getRandomSpot("y", this);
  this.height = (function(y){if (y === 48) {return 1} else {
    return ( ( y - 48 ) / 83 ) + 1
  }})(this.y);
  this.value;
  let it = this;
  this.sprite = (function(){
    let num = getRandomInt(3);
    switch (num) {
      case 2: sprite = 'images/GemOrange.png'; it.value = 50; break;
      case 1: sprite = 'images/GemBlue.png'; it.value = 100; break;
      case 0: sprite = 'images/GemGreen.png'; it.value = 200; break;
    }
    return sprite
  })();
  let isAddingPoints = false;
}

Jewel.prototype.isResetting = false;

Jewel.prototype.reset = function() {
  if (!Jewel.prototype.isResetting) {
  allJewels = [];
  sizes.usedSpots = [];
  sizes.jewelsNum = getRandomInt(6);
  createJewels();
}
}

Jewel.prototype.addPoints = function() {
  if (!this.isAddingPoints) {
    this.isAddingPoints = true;
    obtained.jewels += this.value;
    jewelCount.update();
  }
}

var Rock = function() {
  this.x = sizes.getRandomSpot("x");
  this.y = sizes.getRandomSpot("y", this);
  this.height = (function(y){if (y === 48) {return 1} else {
    return ( ( y - 48 ) / 83 ) + 1
  }})(this.y);
  this.sprite = 'images/Rock.png';
}

Rock.prototype.reset = function() {
  if (!Jewel.prototype.isResetting) {
  allRocks = [];
  sizes.rocksNum = getRandomInt(3);
  createRocks();
}
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Rock.prototype.collision = function(playerX) {
  let collided = false;
  allRocks.forEach(function(rock) {
    if (player.height === rock.height ) {
      if (playerX === rock.x )
      {
        collided = true;
      }
    }
  }
)
return collided;
}

Jewel.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
  this.oldX;
  this.oldY;
  this.oldHeight;
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

if (Rock.prototype.collision(this.x)) {this.x = this.oldX; this.y = this.oldY; this.height = this.oldHeight}

}

Player.prototype.render = function (dt) {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  let it = this;
  if (this.y === -15) {
    Jewel.prototype.reset();
    Rock.prototype.reset();
    Jewel.prototype.isResetting = true;
    setTimeout(function(){
      it.x = sizes.x0P;
      it.y = sizes.y0P;
      Jewel.prototype.isResetting = false;
    }, 100)
    //show the player it has reached victory! then respawn it
  }
  let collidedJewel = Jewel.prototype.collision(this.x);
  if ( collidedJewel && !collidedJewel.isAddingPoints ) {
    collidedJewel.addPoints();
    collidedJewel.value = 0;
    setTimeout(function(){
      collidedJewel.sprite = 'images/GemEmpty.png';
    }, 75)
  }
  if( Enemy.prototype.collision(this.x) ) {
      setTimeout(function(){
        player.reset();
      }, 50)
  }
}

Enemy.prototype.collision = function(playerX) {
  let collided = false;
  allEnemies.forEach(function(enemy) {
    if ( enemy.height === player.height ) {
    if ( playerX <= ( enemy.x + 49 ) &&  playerX >= (enemy.x - 55 ) ) //the enemy has an x range/territory, it shouldn't be identified by 1 point
    {
      collided = true;
    }
  }
  }
)
return collided;
}

Jewel.prototype.collision = function(playerX) {
  let collided = false;
  allJewels.forEach(function(jewel) {
    if (jewel.height === player.height ) {
      if (playerX === jewel.x )
      {
        collided = jewel;
      }
    }
  }
)
return collided;
}

Player.prototype.handleInput = function(keyCode) {
  this.oldX = this.x;
  this.oldY = this.y;
  this.oldHeight = this.height;
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
var allJewels = [];
var allRocks = [];
var stillObjects = []; //align z index of rocks and jewels etc correctly by sorting them in an array
// from lowest y value to highest and calling the render method on this new array instead
for (var i=0; i<sizes.enemiesNum; i++) {
  allEnemies.push(new Enemy());
}
function createJewels() {
  for (var e=0; e<sizes.jewelsNum; e++) {
    allJewels.push(new Jewel());
}
}
function createRocks() {
  for (var i=0; i<sizes.rocksNum; i++) {
    allRocks.push(new Rock());
  }
}
createRocks();
createJewels();

function orderStillObjects() { //this is how we allign the still objects' visuals correctly
  stillObjects.push(...allJewels);
  stillObjects.push(...allRocks);
  stillObjects.sort(function(obj1, obj2) {
    return obj1.y - obj2.y;
  })
}
orderStillObjects();


var jewelCount = new Counter("jewel");
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
