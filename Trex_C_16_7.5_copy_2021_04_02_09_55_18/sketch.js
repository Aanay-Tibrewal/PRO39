var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

var floor;

function preload(){
  trex_running = loadAnimation("Run (1).png","Run (2).png","Run (3).png","Run (4).png","Run (5).png","Run (6).png","Run (7).png","Run (8).png");
  trex_collided = loadAnimation("Dead (1).png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("clouds.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle.3.png");
  obstacle4 = loadImage("obstacle.4.png");
  obstacle5 = loadImage("obstacle.5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  var message = "This is a message";
 //console.log(canvasSize);
  
  trex = createSprite(100,displayHeight - 1100);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.25;
  
  ground = createSprite(displayWidth - 200,displayHeight  - 185,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(displayWidth - 700,displayHeight - 500);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth - 700,displayHeight - 400);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(displayWidth - 1300,displayHeight - 180,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",-100,75,trex.width - 1100,trex.height - 200);
  trex.debug = true

  //obstaclesGroup.debug = true
  
  score = 0;
 //push();
 floor = createSprite(displayWidth/2 , displayHeight - 90, displayWidth, displayHeight/4);
 //fill(237,237,71); 
floor.shapeColor = [237,237,71];
//pop();
}

function draw() {
  
  background(0,185,246);
  //displaying score
  text("Score: "+ score, displayWidth - 100,displayHeight - 700);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= displayHeight - 250) {
        trex.velocityY = -16;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     
       if(mousePressedOver(restart)) {
    reset();
    
    }
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  



  drawSprites();
}

function reset(){
  
gameState = PLAY; 
  obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
   trex.changeAnimation("running", trex_running);
  score = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth,displayHeight - 215,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.75;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 70 === 0) {
    var cloud = createSprite(displayWidth,displayHeight - 500,40,10);
    cloud.y = Math.round(random(displayHeight - 250,displayHeight - 500));
    cloud.addImage(cloudImage);
    cloud.scale = 0.25;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = restart.depth + 1;
    restart.depth = gameOver.depth + 1;
    gameOver.depth = gameOver.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

