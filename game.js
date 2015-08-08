var noseX = 0;
var noseY = 0;
var canvas;
var alphaset =0;
var linealpha =alphaset.toFixed(2);
var context;
var CursorRatioX = 10;
var CursorRatioY = 10;
var gamew = 1200; //width of our game space
var gameh = 600; //height of our game space
var shipSize = 60 //size of our ship
var angleRate = .5; //reduces or increases the angle by a rate   
var xAngle = 0; //global variable for horizontal angle of the device
var yAngle = 0; //global variable for vertical angle of the device
var spin = 1;
var shipx = gamew * .5;
var shipy = gameh * .5;
var spinr;
var spinl;
var rotatespeed = 0;
var touchX = 0;
var touchY = 0;
var shot;
var xhairRadian;
var shotstart = 0;
var shipRadian;
var xhairRadianround;
var spinRound;
var speedmax = 20;
var spindefault = 0;
var spinspeed = spindefault
var direction;
var deltaRadian;
var shotprogress = false;
var laserstatus = 0;
var h = 0;
var laserstart = 0;
var right;
var xforcespeed = 0;
var yforcespeed = 0;
var left;
var down;
var up;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.x - rect.left,
      y: evt.y - rect.top
    };
}

setInterval(game, 25); // waits 25 milliseconds then repeats all of the above
//setTimeout(game, 100);
function game() { 
    canvas = document.getElementById('gameCanvas');
    context = canvas.getContext('2d'); // context is the variable to envoke all Canvas commands
    context.clearRect(0, 0, gamew, gameh); // Clears the entire screen
    context.strokeStyle = "gray" // Color of the object lines
    context.lineWidth = 2;
    context.fillStyle = "grey"; // Color of the Game Space
    context.strokeRect(0, 0, gamew, gameh); //Draw Game Space  
    context.save(); // Save the canvas location
    context.strokeStyle = "white" // Color of the object lines
    
    if(laserstatus>0 && laserstart>0){// draw color the laser red when fired
    	h++;
	}

	crosshairs();
	drawship();
	context.save();
	context.restore();
	
	if (shot){  // when head is moved we calculate the angle to the point clicked
  		laserstatus=1;
  		xhairRadian=Math.atan2(touchY-shipy, touchX-shipx);  // Calculate radian angle of target fire
  		if(xhairRadian<=0){                                                // The above calulate a negative radian. Turn the negative radian into is positive counterpart
    		xhairRadian=2*Math.PI+xhairRadian;
    	}
  		deltaRadian=xhairRadian-shipRadian   ;                        
  		if (deltaRadian < -Math.PI || deltaRadian > Math.PI){   // determine if the spin direction should be left or right
      		if(xhairRadian<shipRadian){
    			direction="right";
    		} if(xhairRadian>shipRadian){
      			direction="left";
      		}
   		} else {                                                        // else if the difference in angle is positive spin toward the right
      		if (xhairRadian > shipRadian) {
          		direction = "right";
    		} if(xhairRadian<shipRadian){                    /// if the difference in angls is negative spin toward the left
      			direction="left";
      		}
   		}
  		shotstart=1;                                           // shotstart = 1 means we've finished the calculations and are ready to shoot the laser at the target
     }
}

function crosshairs() { //draws the crosshairs
    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');

    context.save();
    context.translate(touchX, touchY);
    //context.translate(300, 100);
    context.beginPath();
    context.moveTo(0, -20)
    context.lineTo(0, 20)
    context.moveTo(-20, 0)
    context.lineTo(20, 0)
    context.rotate(-45 * Math.PI / 180);
    context.strokeRect(-10, -10, 20, 20);
    context.restore();
    context.stroke();
}

function drawShot() { // determines if we can draw laser fire
    laserstart = 1;
    if (laserstatus > 0 && h > 0) {
        drawlaser();
        shot = false;
    }
    if (h > 7) {
        h = 0;
        laserstatus = 0;
        laserstart = 1;
    }
}

function spincalc() { //calculates the spin number to rotate the ship with variable speed
    if (shotstart == 1) { //if the shot was made start to spin the ship
        if (direction == "left") {
            spinspeed--; //if not at top speed then increase the speed of the ship turning in the negative direction
            if (spinspeed < (speedmax * -1)) {
                spinspeed = (speedmax * -1); //if you hit top speed don't increase the speed anymore
            }
        } else {
            spinspeed++; //if not at top speed then increase the speed of the ship turning in the positive direction
            if (spinspeed > speedmax) { //if you hit top speed don't increase the speed anymore
                spinspeed = speedmax;
            }
        }
        if (spin >= 360) { //if you've come all the way around, reset the spin by 360
            spin = spin - 360;
        }
        if (spin <= 0) { //if you've come all the way around, reset the spin by 360
            spin = spin + 360;
        }
        spin += spinspeed;
        spinspeed *= 1.6;
        //round out the variables so they are easier to work with
        xhairRadianround = Math.round(xhairRadian * 10) / 10;
        spinRound = Math.round(shipRadian * 10) / 10;
        spin = Math.round(spin * 100) / 100
    }
}

function drawship() { 
	var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    spincalc()
    context.save(); // Save the canvas location  
    rotateship();
    makeship();
    context.restore(); // Restores our canvas (to its X&Y position - that way the game space rectangle is drawn at the same spot next time
    if (shipRadian == xhairRadian) {
        drawShot();
        shotprogress = true;
    }
}

function rotateship() { //rotates the ship
    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    if (spinRound >= xhairRadianround - 0.5 && spinRound <= xhairRadianround + 0.5 || spinRound > Math.PI * 2 || spinRound < 0) {; //if the ships close enough to the proper angle no need to animate just point the ship at the cursor
        shipRadian = xhairRadian;
        spinspeed = spindefault;
        shotstart = 0;
    } else { //if the angle is far enough off start to spin the ship 
        shipRadian = (spin * Math.PI / 180)
    }
    context.translate(shipx, shipy); // Move the Canvas Coordinates to the ship X & Y position (remember this moves each time)
    context.rotate(shipRadian);
}

function drawlaser() {
    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    context.save();
    context.beginPath();
    context.translate(shipx, shipy);
    context.rotate(shipRadian - (-90 * Math.PI / 180))
    context.moveTo(shipSize * -.3, shipSize * -.3);
    context.restore();
    context.lineTo(touchX, touchY);
    context.save();
    context.translate(shipx, shipy);
    context.rotate(shipRadian - (-90 * Math.PI / 180));
    context.moveTo(shipSize * .3, shipSize * -.3);
    context.restore();
    context.lineTo(touchX, touchY);
    alphaset = 1-(h/20);
    linealpha = alphaset.toFixed(2);
    context.strokeStyle = "rgba(255, 0, 0,"+ linealpha+")";
    context.stroke();
    context.restore();
}

function makeship() {
    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    context.save();
    context.rotate(-90 * Math.PI / 180);
    context.beginPath();
    context.moveTo(shipSize * -.3, shipSize * .2);
    context.lineTo(shipSize * -.4, shipSize * -.1);
    context.lineTo(shipSize * .1, shipSize * .4);
    context.lineTo(0, shipSize * .5);
    context.lineTo(shipSize * -.1, shipSize * .4);
    context.lineTo(shipSize * .4, shipSize * -.1);
    context.lineTo(shipSize * .3, shipSize * .2);
    context.moveTo(shipSize * -.4, shipSize * -.1);
    context.lineTo(shipSize * .3, shipSize * -.5);
    context.lineTo(0, shipSize * .3);
    context.lineTo(shipSize * -.3, shipSize * -.5);
    context.lineTo(shipSize * .4, shipSize * -.1);
    context.strokeStyle = "white";
    context.stroke();
    context.restore();
}

window.onload = function() {
    
};
                             
if (shot) { // when clicking mouse we calculate the angle to the point clicked
   	//laserstatus = 1;
    if (raisedbrow > 68){
    	laserstatus = 1;
    }
    else {
        laserstatus = 0;
    }
    xhairRadian = Math.atan2(touchY - shipy, touchX - shipx); // Calculate radian angle of target fire
    if (xhairRadian <= 0) { // The above calulate a negative radian. Turn the negative radian into is positive counterpart
        xhairRadian = 2 * Math.PI + xhairRadian;
    }
    deltaRadian = xhairRadian - shipRadian
    if (deltaRadian < -Math.PI || deltaRadian > Math.PI) { // determine if the spin direction should be left or right
        if (xhairRadian < shipRadian) {
            direction = "right";
        }
        if (xhairRadian > shipRadian) {
            direction = "left";
        }
    } else { // else if the difference in angle is positive spin toward the right
        if (xhairRadian > shipRadian) {
            direction = "right";
        }
        if (xhairRadian < shipRadian) { /// if the difference in angls is negative spin toward the left
            direction = "left";
        }
    }
    shotstart = 1; // shotstart = 1 means we've finished the calculations and are ready to shoot the laser at the target
}