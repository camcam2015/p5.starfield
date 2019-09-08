var currentTime;
var deltaTime;
var previousTime;
var maxSpeed = 100;
var spawnSpeed = 1;
var stars = [];
var starSize = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  currentTime = millis() / 60;
  deltaTime = currentTime - previousTime;
  previousTime = currentTime;


  // speed of spawn determined by draw function
  if (frameCount % round(60 * spawnSpeed / 100) == 0) {
    let spawned = new Star(0, 0, 1, starSize);
    stars.push(spawned);
    spawned.spawn();
  }

  stars.forEach(function(star) {
    // move star
    star.computeVelocity(deltaTime);
    star.computePosition(deltaTime);

    // despawn if outside of canvas bounds, the weird shit is to keep track of the index
    if (star.x < 0 || star.x > width || star.y < 0 || star.y > height) {
      stars.splice(stars.indexOf(star), 1);
      starsAdded = 0;
    }

    // draw star
    star.draw();
  });
}





/*                *
 *                 *
 *     CLASSES     *
 *                 *
 *                 */

class Star {
  constructor(posX, posY, relativeSpeed, starSize /* color? */ ) {
    this.speed = relativeSpeed;
    this.x = posX;
    this.y = posY;
    this.theta = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.mass = 2;
    this.size = starSize;
  }

  spawn() {
    // console.log('star spawned!');
    this.x = random(width / 2 - 50, width / 2 + 50);
    this.y = random(height / 2 - 50, height / 2 + 50);
    this.theta = atan2(this.y - height / 2, this.x - width / 2);
  }

  computeVelocity(dt) {
    let forceX = cos(this.theta);
    let forceY = sin(this.theta);
    // print("forceX: " + forceX);
    // print("forceY: " + forceY);

    let accelerationX = forceX / this.mass;
    let accelerationY = forceY / this.mass;

    if (accelerationX != 0 || accelerationY != 0 && (forceX != 0 || forceY != 0)) {
      this.velocityX += accelerationX * dt;
      this.velocityY += accelerationY * dt;
    }

    if (accelerationX == 0 && accelerationY == 0) {
      if (this.velocityX != 0 || this.velocityY != 0) {
        this.velocityX += (this.velocityX * -1) / 100;
        this.velocityY += (this.velocityY * -1) / 100;
      }
    }
  }

  dampVelocity() {
    if (this.velocityX > maxSpeed) {
      this.velocityX = maxSpeed;
    }
    if (this.velocityX < -maxSpeed) {
      this.velocityX = -maxSpeed;
    }
    if (this.velocityY > maxSpeed) {
      this.velocityY = maxSpeed;
    }
    if (this.velocityY < -maxSpeed) {
      this.velocityY = -maxSpeed;
    }
  }

  computePosition(dt) {
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;
    // print("Pos X: " + this.posX);
    // print("Pos Y: " + this.posY);
  }

  draw() { // add logic: color starts transparent, fades into white 
    let distFromCenter = dist(width / 2, height / 2, this.x, this.y);
    let sizeMarginInner = height/4;
    let sizeMarginOuter = 20;
    
    if(this.x < sizeMarginInner || this.x > width - sizeMarginInner || this.y < sizeMarginInner || this.y > height - sizeMarginInner) {
       this.size = starSize + 1;
    }

    if(this.x < sizeMarginOuter || this.x > width - sizeMarginOuter || this.y < sizeMarginOuter || this.y > height - sizeMarginOuter) {
       this.size = starSize + 2;
    }
    
    push();
    fill(255, 255, 255, distFromCenter + 20);
    noStroke();
    circle(this.x, this.y, this.size);
    pop();
  }
}


/*       ~~~~TO-DOS~~~~        */

// add random variation to speed of all stars
