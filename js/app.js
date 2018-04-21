let sizes = {
  canvasWidth: 505,
  horizontalStep: 101,
  verticalStep: 83,
  enemiesNum: 6,
  jewelsNum: getRandomInt(7),
  rocksNum: getRandomInt(4)+1,
  heartsNum: getRandomInt(2)+1,
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
let designRelated = {
  counterX: {
  jewelCount: function() {
    if (designRelated.counterWidth.jewelCount) { return ( 80-0.25*designRelated.counterWidth.jewelCount ) }
    else {return 75}},
  stageCount: function () {
    if (designRelated.counterWidth.jewelCount && designRelated.counterWidth.stageCount) {
       return ( 0.24*designRelated.counterWidth.jewelCount + 233  - 0.0056*(designRelated.counterWidth.stageCount * (designRelated.counterWidth.stageCount * 0.5)) )
    }
    else {return 245}},
  livesCount: function () {
    if (designRelated.counterWidth.jewelCount) { return ( 405 - 0.52*designRelated.counterX.jewelCount() ) }
    else {return 380}}
},
  counterWidth: {
    jewelCount: false,
    stageCount: false,
  }
}
let obtained = {
  jewels: 0,
  lives: 5,
  stage: 1,
  invincibillity: false,//timeoutID
  gameOver: false,
  win: false
}
let stage5 = {
  generateLock: function() {
    lock = new Lock(404, -35);
    allRocks.push(lock);
    stillObjects.push(lock);
  },
  rocksPositions: [
  {"x": 202,"y": -35},
  {"x": 303,"y": -35},
  {"x": 101,"y": -35},
  {"x": 0,"y": -35},
  {"x": 303,"y": 48},
  {"x": 303,"y": 131},
  {"x": 303,"y": 214},
  {"x": 303,"y": 297},
  {"x": 101,"y": 131},
  {"x": 101,"y": 214},
  {"x": 101, "y": 297},
  {"x": 101, "y": 380}
],
  generateRocks: function() {
    allRocks = [];
    stage5.rocksPositions.forEach(function (position) {
      allRocks.push(new Rock(position.x, position.y));
    })
    stillObjects.push(...allRocks);
  },
  generateEnemies: function() {
    createEnemies(4);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var Counter = function(type) {
  this.type = type;
  this.x;
  this.y = 40;
  this.value;
  if (this.type === "jewel") {
    this.value = obtained.jewels;
    this.x = designRelated.counterX.jewelCount();
  }
  else if (this.type === "lives") {
    this.value = obtained.lives;
    this.x = designRelated.counterX.livesCount();
  }
  else if (this.type === "stage") {
    this.value = obtained.stage;
    this.x = designRelated.counterX.stageCount();
  }
  //DESIGN RELATED:
  this.widthOfText;
  this.widthOfSubtext;
}

Counter.prototype.update = function(arg) {
  if (this.type === "jewel") {
    this.value = obtained.jewels;
    setTimeout(function() {
    jewelCount.x = designRelated.counterX.jewelCount();
    stageCount.update("design");
    livesCount.update("design");
  },1);
  }
  else if (this.type === "lives" && arg !== "design") {
    this.value = obtained.lives;
  }
  else if (this.type === "stage" && !Jewel.prototype.isResetting && arg !== "design") {
    this.x = designRelated.counterX.stageCount();
    this.value = obtained.stage;
  } else if (this.type === "stage" && arg === "design") {
    this.x = designRelated.counterX.stageCount();
  } else if (this.type === "lives" && arg === "design") {
    this.x = designRelated.counterX.livesCount();
  }
}

Counter.prototype.render = function() {
  ctx.font = '36px Tahoma';
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#000000';
  ctx.strokeText(this.value, this.x, this.y);
  this.widthOfText = ctx.measureText(this.value).width;
  ctx.font = '21px Tahoma';
  if (this.type === "jewel") {
    ctx.fillText('points', this.x+this.widthOfText+5, this.y);
  }
  else if (this.type === "lives") {
    ctx.fillText('lives', this.x+this.widthOfText+5, this.y);
  }
  else if (this.type === "stage") {
    ctx.fillText(' Stage', this.x+this.widthOfText, this.y);
  }
  this.widthOfSubtext = ctx.measureText(this.type).width;
  this.updateDesign();
}

Counter.prototype.updateDesign = function() {
  if (this.type === "jewel") {
    designRelated.counterWidth.jewelCount = this.widthOfSubtext + this.widthOfText;
  } else if (this.type === "stage") {
    designRelated.counterWidth.stageCount = this.widthOfSubtext + this.widthOfText;}
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
  this.isAddingPoints = false;
}

var Key = function(x, y) {
  this.x = x;
  this.y = y;
  sizes.usedSpots.push({"x": this.x, "y": this.y});
  this.height = (function(y){if (y === 48) {return 1} else {
    return ( ( y - 48 ) / 83 ) + 1
  }})(this.y);
  this.value = 1;
  this.sprite = 'images/Key.png';
}

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Key.prototype.collision = function(playerX) {
  let collided = false;
    if (player.height === this.height ) {
      if (playerX === this.x )
      {
        collided = true;
        this.sprite = 'images/GemEmpty.png';
        this.value = 0;
      }
    }
return collided;
}

Jewel.prototype.isResetting = false;

Jewel.prototype.reset = function() {
  if (!Jewel.prototype.isResetting) {
  if (obtained.stage === 5) { } else {
  createJewels();
  createHearts();
   }
}
}

Jewel.prototype.addPoints = function() {
  if (!this.isAddingPoints) {
    this.isAddingPoints = true;
    obtained.jewels += this.value;
    jewelCount.update();
  }
}

var Heart = function() {
  this.x = sizes.getRandomSpot("x");
  this.y = sizes.getRandomSpot("y", this);
  this.value = 1;
  this.height = (function(y){if (y === 48) {return 1} else {
    return ( ( y - 48 ) / 83 ) + 1
  }})(this.y);
  this.sprite = 'images/Heart.png';
  this.isAddingPoints = false;
}

Heart.prototype.addPoints = function() {
  if (!this.isAddingPoints) {
    this.isAddingPoints = true;
    obtained.lives += this.value;
    livesCount.update();
  }
}

var Rock = function( x , y ) {
  if (!x && !y) {
  this.x = sizes.getRandomSpot("x");
  this.y = sizes.getRandomSpot("y", this); }
  else {
  this.x = x;
  this.y = y;
  sizes.usedSpots.push({"x": this.x, "y": this.y});
  }
  this.height = (function(y){if (y === 48) {return 1} else {
    return ( ( y - 48 ) / 83 ) + 1
  }})(this.y);
  this.sprite = 'images/Rock.png';
}

Rock.prototype.reset = function() {
  if (!Jewel.prototype.isResetting) {
  allRocks = [];
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
      orderAllObjects();
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
  if (!Player.prototype.isResetting) {
    this.height = 5;
    obtained.lives--;
    if (obtained.lives >= 0) {
        this.x = sizes.x0P;
        this.y = sizes.y0P;
        livesCount.update() // update counter on screen
      }
    else {
      this.sprite = 'images/GemEmpty.png';
      tellGameOver();
    }
}
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
  if (this.y === -98) {
    this.y = -15;
  }

if (Rock.prototype.collision(this.x)) {this.x = this.oldX; this.y = this.oldY; this.height = this.oldHeight}

}


Player.prototype.render = function (dt) {
  if (obtained.invincibillity) {
    ctx.drawImage(Resources.get('images/Selector2.png'), this.x, this.y);
  } // render the "invincibillity" sprite
  if (player.changePlayerSprite) {
    ctx.drawImage(Resources.get('images/Selector.png'), this.x, this.y);
  }
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  let it = this;
  if (this.height === 0 && obtained.stage !== "Bonus") {
    it.height = 5; //immediately "save" the player from false collision with enemy
    if (obtained.stage === 5 && !Jewel.prototype.isResetting) {
      setTimeout(
        function() { tellWin(); }, 100
    )
      sizes.jewelsNum = 10;
      sizes.heartsNum = 10;
      sizes.rocksNum = 0;
      obtained.stage = 'Bonus';
      stageCount.update();
      jewelCount.update() // DESIGN RELATED
    } else if (!Jewel.prototype.isResetting) {
      obtained.stage++;
      stageCount.update();
      jewelCount.update() // DESIGN RELATED
    }
    if (obtained.stage === 5 && !Jewel.prototype.isResetting ) {
      sizes.usedSpots = [];
      stage5.generateRocks();
      stage5.generateEnemies();
      stage5.generateLock();
      key = new Key(0, 380);
      Jewel.prototype.reset();
      createJewels();
      createHearts();
      allJewels.push(key);
      stillObjects.push(key);
      orderStillObjects();
      orderAllObjects();
    }
    else if ( obtained.stage !== 5 && !Jewel.prototype.isResetting ) {
      sizes.usedSpots = [];
      Rock.prototype.reset();
      Jewel.prototype.reset();}
    Jewel.prototype.isResetting = true;
    orderStillObjects();
    orderAllObjects();
    setTimeout(function(){
      it.x = sizes.x0P;
      it.y = sizes.y0P;
      Jewel.prototype.isResetting = false;
    }, 100)
    //show the player it has reached victory! then respawn it
  }
  let collidedJewel = Jewel.prototype.collision(this.x);
  let collidedHeart = Heart.prototype.collision(this.x);
  if ( collidedJewel && !collidedJewel.isAddingPoints ) {
    if (collidedJewel !== key) {
    collidedJewel.addPoints();
    collidedJewel.value = 0;
    setTimeout(function(){
      collidedJewel.sprite = 'images/GemEmpty.png';
    }, 75)}
  }
  if (collidedHeart && !collidedHeart.isAddingPoints) {
    collidedHeart.addPoints();
    collidedHeart.value = 0;
    setTimeout(function(){
      collidedHeart.sprite = 'images/GemEmpty.png';
    }, 75)
  }
  if ( key && key.collision(this.x) ) {
    let lockIndex1 = stillObjects.indexOf(lock);
    if (lockIndex1 !== -1)  {stillObjects.splice(lockIndex1, 1)};
    let lockIndex2 = allRocks.indexOf(lock);
    if (lockIndex2 !== -1)  {allRocks.splice(lockIndex2, 1)};
    orderAllObjects();
  }
  if( Enemy.prototype.collision(this.x) && obtained.invincibillity ) {

  }
  else if( Enemy.prototype.collision(this.x) ) {
            player.reset()
            Player.prototype.isResetting = true;
      obtained.invincibillity = setTimeout(function() {
          Player.prototype.isResetting = false;
          obtained.invincibillity = false;
      }, 350) // the time gap between the first timeout and the second timeout
      // is assumed to prevent getting double damage from two enemies
      // this can also be used for an after-death invincibillity time gap
}
}

Player.prototype.isResetting = false;

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

Heart.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Heart.prototype.collision = function(playerX) {
  let collided = false;
  allHearts.forEach(function(heart) {
    if (heart.height === player.height) {
      if (playerX === heart.x)
      {
        collided = heart;
      }
    }
  })
  return collided
}

Player.prototype.changePlayerSprite = false;

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
      if (this.y >= -15) {
      this.y -= sizes.verticalStep; }
      break;
    case 'down':
      this.y += sizes.verticalStep;
      break;
    case 'x':
      if (Player.prototype.changePlayerSprite) {
      clearTimeout(Player.prototype.changePlayerSprite);
      Player.prototype.changePlayerSprite = setTimeout(function(){Player.prototype.changePlayerSprite = false}, 400);
    } else {
      Player.prototype.changePlayerSprite = setTimeout(function(){Player.prototype.changePlayerSprite = false}, 400);
    }
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
  else if (y===-15) {return 0}
  else {
  return ( ( (y - 68) / 83 ) + 1 )
  }
})(this.y)

}

class Lock extends Rock {
  constructor(x, y, isLocked) {
    super(x, y);
    this.isLocked = true;
    this.sprite = 'images/Lock.png';
  }
  open() {
    window.this = null;
    delete window.this;
  }
}

var GameOverScreen = function() {
  this.x = 157;
  this.y = 303;
  this.text = 'Game Over';
  this.subtext = 'Press Z to Play Again';
};

var WinScreen = function() {
  this.x = 157;
  this.y = 303;
  this.points = obtained.jewels;
  this.lives = obtained.lives;
  this.text = 'You Win!';
  this.points = 0;
  this.subtext = `Your score is: ${this.points}`;
  this.outText = 'Press Z to Play Again';
}

function tellWin() {
  WinScreen.prototype.render = function() {
    ctx.fillStyle = '#d5f4f5';
    ctx.fillRect(this.x-20,this.y-60,227,110);
    ctx.strokeRect(this.x-26,this.y-62,225,107);
    ctx.strokeStyle = '#251e58';
    ctx.strokeRect(this.x-20,this.y-49,225,107);
    ctx.font = '44px Impact';
    ctx.fillStyle = '#0a1856';
    ctx.fillText(this.text, this.x, this.y);
    ctx.font = '44px Impact';
    ctx.strokeStyle = 'white';
    ctx.strokeText(this.text, this.x, this.y);
    ctx.font = '20px Tahoma';
    ctx.fillStyle = 'black';
    ctx.fillText(this.subtext, this.x+5, (this.y + 27));
    ctx.fillStyle = 'white';
    ctx.fillText(this.outText, this.x+2, (this.y + 90));
  }
  ws = new WinScreen;
  obtained.win = 'true';
  let points = 0;
  let maxLives = obtained.lives;
  let maxJewels = obtained.jewels;
  let jIndex = 0;
  let lIndex = 1;
  let maxPoints = maxLives*maxJewels;
  function countScoreNicely() {
    setTimeout(function() {
      if (points !== maxPoints) {
      if (jIndex !== maxJewels) {
      points+=50;
      obtained.jewels-=50;
      jewelCount.update();
      jIndex+=50;
      } else {
        points = maxJewels * lIndex;
        lIndex++;
        obtained.lives--;
        livesCount.update();
      }
      ws.points = points;
      ws.subtext = `Your score is: ${ws.points}`;
      /*if (lIndex !== maxLives+1 && maxJewels*lIndex === points) {
      console.log(lIndex);
      obtained.lives--;
      livesCount.update();
      lIndex++;
      }*/
      // Slower score count, less aesthetic but was actually harder to think of
      // so I'm keeping it as a comment!
      countScoreNicely();
    }
      else {}
    }, 30);
  }
  countScoreNicely();
  obtained.gameOver = 'true';
}

function tellGameOver() {
  GameOverScreen.prototype.render = function() {
    ctx.fillStyle = '#fdf9f0';
    ctx.fillRect(this.x-20,this.y-50,227,110);
    ctx.strokeRect(this.x-24,this.y-54,225,107);
    ctx.strokeStyle = '#fdf9f0';
    ctx.strokeRect(this.x-13,this.y-42,225,107);
    ctx.font = '44px Impact';
    ctx.fillStyle = 'black';
    ctx.fillText(this.text, this.x, this.y);
    ctx.font = '44px Impact';
    ctx.strokeStyle = '#7a2104';
    ctx.strokeText(this.text, this.x, this.y);
    ctx.font = '20px Tahoma';
    ctx.fillStyle = 'black';
    ctx.fillText(this.subtext, this.x+5, (this.y + 27))
  }
  gms = new GameOverScreen;
  obtained.gameOver = 'true';
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var key;
var gms; // game over screen
var ws; // win screen
var allEnemies = [];
var allJewels = [];
var allRocks = [];
var allHearts = [];
var stillObjects = []; //align z index of rocks and jewels, hearts and key correctly by sorting them in an array
// from lowest y value to highest and calling the render method on this new array instead

function createEnemies(num) {
  allEnemies = [];
  if (!num) {num = sizes.enemiesNum};
  for (var i=0; i<num; i++) {
  allEnemies.push(new Enemy());
}
}
function createJewels() {
  allJewels = [];
  for (var e=0; e<sizes.jewelsNum; e++) {
    allJewels.push(new Jewel());
}
}
function createRocks() {
  allRocks = [];
  for (var i=0; i<sizes.rocksNum; i++) {
    allRocks.push(new Rock());
  }
}
function createHearts() {
  allHearts = [];
  for (var e=0; e<sizes.heartsNum; e++) {
    allHearts.push(new Heart());
  }
}
createEnemies();
createRocks();
createJewels();
createHearts();

function orderStillObjects() { //this is how we allign the still objects' visuals correctly
  stillObjects = [];
  stillObjects.push(...allJewels);
  stillObjects.push(...allRocks);
  stillObjects.push(...allHearts);
  stillObjects.sort(function(obj1, obj2) {
    return obj1.y - obj2.y;
  })
}
orderStillObjects();

var allForeignObjects = [] // We're going to do the same for all objects that don't include the player
// meaning we want the enemies to be visually ordered by height with the other still objects as well
// We'll call a function to order allForeignObjects array every time an enemy changes height

function orderAllObjects() {
  allForeignObjects = [];
  allForeignObjects.push(...stillObjects);
  allForeignObjects.push(...allEnemies);
  allForeignObjects.sort(function(obj1, obj2) {
    return obj1.y - obj2.y;
  })
}
orderAllObjects();

var jewelCount = new Counter("jewel");
var livesCount = new Counter("lives");
var stageCount = new Counter("stage");
var player = new Player();

function newGame() {
  sizes.enemiesNum = 6;
  sizes.jewelsNum = getRandomInt(7);
  sizes.rocksNum = getRandomInt(4)+1;
  sizes.heartsNum = getRandomInt(2)+1;
  obtained.stage = 0;
  stageCount.update();
  obtained.jewels = 0;
  jewelCount.update();
  obtained.lives = 6; //reseting player lowers life by 1
  obtained.gameOver = false;
  gms = false;
  ws = false;
  sizes.usedSpots = [];
  Rock.prototype.reset();
  Jewel.prototype.reset();
  orderStillObjects();
  orderAllObjects();
  player.sprite = 'images/char-boy.png';
  player.reset();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        88: 'x',
        90: 'z'
    };

    if ((!obtained.gameOver && allowedKeys[e.keyCode] !== 'z') || (obtained.gameOver && obtained.win)) {player.handleInput(allowedKeys[e.keyCode]); }
    else if (allowedKeys[e.keyCode] === 'z') {
      newGame();
    }
    if (obtained.win && allowedKeys[e.keyCode] === 'z') {
      newGame();
    }
});
