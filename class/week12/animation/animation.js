//redraw loop
function animationLoop() {

  var animationsToDestroy = []; //to hold any animations that went off the screen

  //tell the browser we want to repaint and when ready use this function
  //endless loop
  window.requestAnimationFrame(animationLoop);

  // Clear the whole canvas
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

  //draw every animation
  for (var i = 0; i < animations.length; i++) {
    animations[i].update(); //change properties (frame and position)
    if (animations[i].render()) { //draw it, returns a boolean that tells us teh sprite went off the screen
      animationsToDestroy.push(animations[i]); //add to destroy array
    }
  }

  // Destroy animations that went off the screen, and spawn new ones to replace them
  for (var j = 0; j < animationsToDestroy.length; j++) {
    destroyAnimation(animationsToDestroy[j]);
    animations[animations.length] = spawnAnimation(); //add the sprite to the end of the animations
  }

}

//a sprite object, update and render
function Sprite(options) {

  //Sprite object properties
  var that = {}, //holds sprite properties
    frameIndex = 0, //what frame are we on
    tickCount = 0, //how much 'time' has gone by
    ticksPerFrame = options.ticksPerFrame || 0, //how many ticks must pass for a channge
    numberOfFrames = options.numberOfFrames || 1; //how many frames in this image


  that.context = options.context; //where is it drawn
  that.width = options.width;
  that.height = options.height;
  that.x = options.x; //where is it on the canvas
  that.y = options.y;
  that.deltaX = Math.floor(Math.random() * 5 + 5); //position change
  that.deltaX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;//randomize negative or positive
  that.deltaY = Math.floor(Math.random() * 5 + 5);
  that.deltaY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  that.image = options.image;
  that.name = options.name;
  that.scaleRatio = options.scaleRatio;
  that.destroy = false; //should we destroy it?

  //Sprite functions
  //update the properties as time goes
  that.update = function() {

    tickCount += 1;
    if (tickCount > ticksPerFrame) { //we will change it
      that.x += that.deltaX;
      that.y += that.deltaY;
      tickCount = 0;

      // If the current frame index is in range
      if (frameIndex < numberOfFrames - 1) {
        // Go to the next frame
        frameIndex += 1;
      } else {
        frameIndex = 0;
      }
    }
  };

  // Draw the animation
  //return whether or not to destroy it (i.e. it went off the screen)
  that.render = function() {
    //are we now off the screen?
    if (that.x < (-1 * that.width / numberOfFrames) || that.x > canvas.width || that.y < (-1 * that.height) || that.y > canvas.height) {
      return true;
    }

    //built-in function that takes the following parameters
    that.context.drawImage(
      that.image,
      frameIndex * that.width / numberOfFrames,
      0,
      that.width / numberOfFrames,
      that.height,
      that.x,
      that.y,
      that.width / numberOfFrames * that.scaleRatio,
      that.height * that.scaleRatio);

    //output some info to the console
    console.log("sprite: " + that.name + " x: " + that.x + " y: " + that.y);
    return false;
  };

  return that;
}

//remove it from the array
function destroyAnimation(animation) {
  //find teh one we want to destory and remove it from the array
  for (var i = 0; i < animations.length; i++) {
    if (animations[i] === animation) { //found it
      animations[i] = null; //destory from memory
      animations.splice(i, 1); //remove an item in the middle
      break; //end the loop
    }
  }
}

//create a sprite
function spawnAnimation() {

  var spriteIndex = Math.floor(Math.random() * spriteImages.length); //get a random index from spriteImages
  var animationImg = new Image(); //make an image object
  animationImg.src = spriteImages[spriteIndex].spriteMapUrl; //get a random sprite sheet
  var scaleRatio = Math.random() * 0.5 + 0.5; //get a random scale
  // add a sprite to the array by returning created sprite with properties; note we use properties from our random item in spriteImages
  return Sprite({
    scaleRatio: scaleRatio,
    context: canvas.getContext("2d"),
    width: spriteImages[spriteIndex].width,
    height: spriteImages[spriteIndex].height,
    image: animationImg,
    name: spriteImages[spriteIndex].name,
    numberOfFrames: spriteImages[spriteIndex].numFrames,
    ticksPerFrame: 1,
    x: Math.random() * (canvas.width - (spriteImages[spriteIndex].width / spriteImages[spriteIndex].numFrames) * scaleRatio),
    y: Math.random() * (canvas.height - spriteImages[spriteIndex].height * scaleRatio)
  });
}

var canvas = document.getElementById("myCanvas"); //where we draw it
canvas.width = screen.availWidth;
canvas.height = screen.availHeight;
//a bunch of sprite data
var spriteImages = [{
    "spriteMapUrl": "images/coin-sprite-animation.png",
    "numFrames": 10,
    "width": 1000,
    "height": 100,
    "name": "coin"
  },
  {
    "spriteMapUrl": "images/Madoka.png",
    "numFrames": 8,
    "width": 809,
    "height": 136,
    "name": "girl"
  },
  {
    "spriteMapUrl": "images/catWalking.png",
    "numFrames": 12,
    "width": 4800,
    "height": 200,
    "name": "cat"
  },
  {
    "spriteMapUrl": "images/sponge.png",
    "numFrames": 10,
    "width": 1128,
    "height": 103,
    "name": "spongebob"
  }
];
var animations = []; //an array to hold the currently existing sprite obects
var maxAnimations = spriteImages.length; //how many animations we want on the screen at any one time

//begin the program, spawn a bunch of animations and we will hold them in animations array
for (var i = 0; i < maxAnimations; i++) {
  animations[i] = spawnAnimation(i); //get a sprite and put it in the array; spawnAnimation returns a Sprite
}

//animation magic
animationLoop();
