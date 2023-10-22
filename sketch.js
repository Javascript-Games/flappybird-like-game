function customImage(){
  
  // Window
  noStroke();  
  fill(211);
  rect(166, 175, 70, 50);
  
  fill(128);
  rect(168, 177, 68, 48)
  
  fill(211);
  rect(170, 180, 20, 20);
  rect(170, 202, 20, 20);
  rect(192, 180, 20, 20);
  rect(192, 202, 20, 20);
  rect(214, 180, 20, 20);
  rect(214, 202, 20, 20);
  
  
  fill(173, 216, 230);
  rect(170, 180, 18, 18);
  rect(170, 202, 18, 18);
  rect(192, 180, 18, 18);
  rect(192, 202, 18, 18);
  rect(214, 180, 18, 18);
  rect(214, 202, 18, 18);
  images.push(get(0,0,width,height));
}




class antiGravMonsObj{
  constructor(x, y, h){
    this.position = new p5.Vector(x,y);
    this.velocity = new p5.Vector(0, 0);
    this.heightBuild = h;
    this.acceleration = new p5.Vector(0, -0.025);
    this.size = 20;
    this.bounceCoeff = -(100 - this.size) / 100;
    this.heightToJump =  400 - this.heightBuild - 60;
    this.falling = false;
  }
  
  updatePosition() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    if (this.position.y > this.heightToJump) {
      this.position.y = this.heightToJump - this.size/2;
      this.velocity.y *= this.bounceCoeff;
      
    }else if(this.position.y < 0){
      this.velocity.y = sqrt(-1 * this.heightToJump * 2 * this.acceleration.y);
    }
      
    if(this.velocity.y < 0){
      this.falling = true;
    }else{
      this.falling = false;
    }
  }
  
  draw(){
        
    push();
    translate(this.position.x, this.position.y + 3);
    rotate(180);
    fill(0,255,0);
    quad( + 6,  - 6,  - 6, -6, - 9, + 6,  + 9,  + 6);
    fill(220);
    stroke(0);
    square(-6, -1, 4.5);
    square(+4, -1, 4.5);
    fill(0,255,0);
    if(this.falling){
      triangle(-9, +6, 0, +6, -9, +4);
      triangle(+9, +6, 0, +6, +9, +4);
    }else{
      triangle(-9, +6, 0, +6, -9, +14);
      triangle(+9, +6, 0, +6, +9, +14);
    }
    pop();
    

  }
} // antiGravMonsObj

class buildingObj{
  constructor(x, y){
    this.heightBuild = random(50, 250);
    this.position = new p5.Vector(x,y - this.heightBuild);
    this.velocity = new p5.Vector(-1, 0);
    this.acceleration = new p5.Vector(0, -0.1);
    this.widthBuild = 50;
    this.deleteThis = false;
    this.createNewBuild = true;
    this.colorBuild = [random(0, 255), random(0, 255), random(0, 255)]
    this.monster = new antiGravMonsObj(this.position.x + 25, 0, this.heightBuild);
  }
  
  updatePosition(){
    if(this.position.x < -50){
       this.deleteThis = true;
    }
    if(this.position.x < 150 && this.createNewBuild){
       buildings.push(new buildingObj(400, 400));
       this.createNewBuild = false;
    }
    this.monster.draw();
    this.monster.updatePosition();
    this.position.x -= 2;
    this.monster.position.x -= 2;
  }
  
  draw(){
    strokeWeight(2);
    stroke(128);
    fill(this.colorBuild);
    rect(this.position.x, this.position.y, this.widthBuild, this.heightBuild);
    
    var howManyWins = (this.heightBuild - 40) / 15;
    
    for(var i = 0; i < howManyWins; i++){
      image(images[0], this.position.x - 38, (this.position.y - 28) + (i * 15), 100, 75);
      image(images[0], this.position.x - 12, (this.position.y - 28) + (i * 15), 100, 75);
    }
    
    fill(128);
    stroke(0);
    strokeWeight(0.5);
    rect(this.position.x + 20, 385, 10, 15);
    
  }
} // buildingObj


class flappyBirdObj {
  constructor(x,y) {
    this.position = new p5.Vector(x,y);
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0.2);
    this.size = 30;
    this.bounceCoeff = -(100 - this.size) / 100;
    this.c1 = random(0, 255);
    this.c2 = random(0, 255);
    this.c3 = random(0, 255);
    this.isJumping = false; 
    this.gameOver = false;
  }
 
  updatePosition() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    if (this.position.y > (height - this.size/2)) {
      this.position.y = height - this.size/2;
      this.velocity.y *= this.bounceCoeff;
      
    }
    if(this.velocity.y > 0){
       this.isJumping = false;
     }  
  }
  
  jump(){
    if (!this.isJumping) { 
      this.velocity.y = -5; 
      this.isJumping = true; 
    }
  }
  
  draw() {
    angleMode(DEGREES);
    fill(255, 255, 0);
    stroke(0);
    strokeWeight(3)
    ellipse(this.position.x, this.position.y, 30, 26)

    fill(255); // The wing
    push();
    translate(this.position.x - 9, this.position.y);
    if(this.isJumping){
      rotate(-20);
    }else{
      rotate(20);
    }
    ellipse(0, 0, 18, 12);
    pop()


    push();
    translate(this.position.x + 9, this.position.y - 4);
    rotate(50);
    ellipse(0, 0, 12, 9);
    fill(0);
    ellipse(2, -2, 2, 1);
    pop()

  }
}


var bird;
var buildings = [];
var score = 0;
var images = [];


function checkCollisionMonsterBuilding(){
  
   
  for(var i = 0; i < buildings.length; i++){
    
    // monster collision
    if(dist(bird.position.x, bird.position.y, buildings[i].monster.position.x, buildings[i].monster.position.y) < 20){
      bird.gameOver = true;
    }
    
    
    // building collision
      if(bird.position.x + 15 > buildings[i].position.x && bird.position.x < buildings[i].position.x + 50){ 
         if(bird.position.y + 15 > buildings[i].position.y){
            bird.gameOver =   true;
         }
      }
    
  }
  
  
  
  // border collision 
  
  if(bird.position.y > 384 || bird.position.y < 16){
     bird.gameOver = true;
  }
  
  
}



function displayScore(){
  text("Score: " + score, 340, 10);
}

// Check building position then if it is past the left border delete it from the list
function checkBuildingPos(){
  for(var i = 0; i < buildings.length; i++){
    if(buildings[i].deleteThis){
      buildings.splice(i, 1);
      score++;
    }
  }
}

function keyPressed() {
  if (keyCode === 32) { // spacebar clicked
    bird.jump();
  }
}

function setup() {
  createCanvas(400, 400);
  bird = new flappyBirdObj(30, 200);
  for(var i = 0; i < 1; i++){
    buildings.push(new buildingObj(350, 400))
  } 
  customImage();
}

function draw() {
  checkCollisionMonsterBuilding();
  if(bird.gameOver){
    textSize(36);
    textAlign(CENTER);
    text("Game Over", 200, 200);
  }else{
    background(173, 216, 230);
    bird.updatePosition();
    bird.draw();
    checkBuildingPos();
    displayScore();
    for(var i = 0; i < buildings.length; i++){
      buildings[i].draw();
      buildings[i].updatePosition();
    }
  }
}
