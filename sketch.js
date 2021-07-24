const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon, cannonBall,boat;
var balls=[];
var boats=[];
var boatAnimation=[];
var boatSpritedata,boatSpritesheet;
var boatFrames;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;
var brokenBoatFrames;

var waterSplashAnimation=[];
var waterSplashSpritedata,waterSplashSpriteSheet;
var waterSplashFrames;
var backgroundMusic,waterSound,pirateLaughSound,cannonExplosion;
var isGameOver = false;
var isLaughing = false;
var score=0;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata=loadJSON("assets/boat/boat.json");
  boatSpritesheet=loadImage("assets/boat/boat.png");
  
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
  
  waterSplashSpritedata=loadJSON("assets/water_splash/water_splash.json");
  waterSplashSpriteSheet=loadImage("assets/water_splash/water_splash.png");
  
  backgroundMusic = loadSound("./assets/background_music.mp3");
  waterSound = loadSound("./assets/cannon_water.mp3");
  pirateLaughSound = loadSound("./assets/pirate_laugh.mp3");
  cannonExplosion = loadSound("./assets/cannon_explosion.mp3");

}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);

  boat = new Boat(width, height - 100, 200, 200, -100);
  boatFrames=boatSpritedata.frames;
  for(var i=0;i<boatFrames.length;i++){
    var pos=boatFrames[i].position;
    var img=boatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }

  brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);

    waterSplashFrames=waterSplashSpritedata.frames;
    for(var i=0;i<waterSplashFrames.length;i++){
      var pos=waterSplashFrames[i].position;
      var img=waterSplashSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
      waterSplashAnimation.push(img);
    }

  }
}

function draw() {
  background(189);
 image(backgroundImg,0,0,width,height);
  Engine.update(engine);

  textSize(40);
  text(`Score:${score}`,width-200,50);
  textAlign(CENTER,CENTER);

  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
    backgroundMusic.setVolume(0.1);
  }
  showBoats();
    tower.display();
    cannon.display();
    
  
  
  for(var i=0;i<balls.length;i++){
    showCannonBalls(balls[i],i);
    for(var j=0;j<boats.length;j++){
      if(balls[i]!==undefined && boats[j]!== undefined){
       var collision=Matter.SAT.collides(balls[i].body,boats[j].body);
       if(collision.collided){
         if(!boats[j].isBroken && !balls[i].isSink){
          score+=5;
          boats[j].remove(j);
           i--;
         }
       
       }
       
      }
    }
  }
  

  
 
}
function keyPressed(){
  if (keyCode===DOWN_ARROW){
    cannonBall=new CannonBall(cannon.x,cannon.y);
    balls.push(cannonBall);
      
  }

}
function showCannonBalls(ball,index){
ball.display();
if(ball.body.position.x>=width || ball.body.position.y >= height -50){
  if(!ball.isSink)
  {
    waterSound.play();
     ball.remove(index);
  }
}

}
function keyReleased() {
  if (keyCode === DOWN_ARROW) { 
    cannonExplosion.play();
    balls[balls.length - 1].shoot();
  }
}

function showBoats(){
  if(boats.length>0){
    if(boats.length<4 && boats[boats.length-1].body.position.x<width-300){
      var positions=[-130,-100,-120,-80];
      var position=random(positions);
      var boat=new Boat(width,height-100,200,200,position,boatAnimation);
      boats.push(boat);
    }
    for(var i=0;i < boats.length;i++){
      Matter.Body.setVelocity(boats[i].body,{
        x:-0.9,
        y:0
      });
      boats[i].display();
      boats[i].animate();
      var collision = Matter.SAT.collides(tower.body, boats[i].body);
      if (collision.collided && !boats[i].isBroken) {
         //Added isLaughing flag and setting isLaughing to true
         if(!isLaughing && !pirateLaughSound.isPlaying()){
          pirateLaughSound.play();
          isLaughing = true
        }
        isGameOver = true;
        gameOver();
      }
    }

  }
  else{
    var boat=new Boat(width,height-60,200,200,-60,boatAnimation);
    boats.push(boat);
  }
}

function gameOver() {
  swal(
    {
      title: `Game Over!!!`,
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}




