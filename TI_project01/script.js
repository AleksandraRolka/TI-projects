
// converts degrees to radians
function d2r(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}



let canvas = document.getElementById('canvas1');
let parent = document.getElementById("pendulum");
let ctx = canvas.getContext("2d");
canvas.width = parent.offsetWidth*0.98;
canvas.height = parent.offsetHeight*0.96;

var w = canvas.width;
var h = canvas.height;
// width, height of the grid
var step = w / 30;

// coordinates for the beginning of the pendulum
const xb = w * 0.5;
const yb = step;

// radius od the the pendulum hanger
const radiusDot = 4;
// swing angle in radians
let angle = 0.5236;
// radius od the the spherical weight
const radius = step*8;

// starting coordinates for the end of the pendulum
let xe_0 = w * 0.5;	
let ye_0 = radius;

// coordinates for the end of the pendulum
let xe = xe_0-radius;
let ye = ye_0-radius;

//its value is change is change by "Start"/"Stop" buttons
var simulate = true;
// tells if option with resistance is selected
var resistance = false; 

// at the beginning "Stop" button is disable, user can only click on "Start" button
document.getElementById("stopButton").disabled = true;


// draws coordinate system grid with a pendulum hanger
function drawCoordinateSystemGrid() {
	// clears the canvas
	ctx.clearRect(0, 0, w, h);
	ctx.beginPath();
	for (var x = 0; x <= w; x += step) {
		ctx.moveTo(0.5 + x, 0);
		ctx.lineTo(0.5 + x, h);
	}
	for (var y = 0; y <= h; y += step) {
		ctx.moveTo(0, 0.5 + y);
		ctx.lineTo(w, 0.5 + y);
	}
	ctx.strokeStyle = "#d1d1e0";
	ctx.stroke();
	
	// drawing pendulum hanger
	ctx.beginPath();
	ctx.arc(xb, yb, radiusDot, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#003399';
	ctx.fill();
	ctx.strokeStyle = '#003399';
	ctx.stroke();
	ctx.strokeStyle = '#003399';
	}
drawCoordinateSystemGrid();


var p;
var dt;
var minLeft = d2r(40);
var middle = d2r(90);
var minRight = d2r(140);
var d_angle = d2r(1);


// changes options' ability
function pendulumStopped()
{
	stopB.disabled = true;
	startB.disabled = false;
	stopB.classList.remove(stopB.classList.item(0));
	stopB.classList.add("buttons");
	startB.classList.remove(startB.classList.item(0));
	startB.classList.add("startButton");
	document.getElementById("withoutResistance").disabled=false;
	document.getElementById("withResistance").disabled=false;
}


// draws pendulum on the right place if motion goes from the middle to the right
function drawLine_mid_right() {
	drawCoordinateSystemGrid();
	xe = xe_0 + radius * Math.cos(angle);
	ye = radius * Math.sin(angle);
	ctx.beginPath();
	ctx.moveTo(xb, yb);
	ctx.lineTo(xe, ye);
	ctx.stroke();
	angle = angle - d_angle;
	
	ctx.beginPath();
	ctx.arc(xe, ye, radiusDot*5, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#6699ff';
	ctx.fill();
	ctx.strokeStyle = '#6699ff';
	ctx.stroke();
	
	if(simulate){
		if(angle >= minLeft){
			p += dt;
			setTimeout(drawLine_mid_right, p);
		}
		else if(d_angle>0){
			angle = minLeft;
			if(resistance){
				p*=1.01;
			}
			drawLine_right_mid();
		}
		else{
			// change buttons options when pendulum ends swinging 			
			pendulumStopped();
		}
	}
	else{	
		drawCoordinateSystemGrid();
	}
}

// draws pendulum on the right place if motion goes from the left to the middle
function drawLine_left_mid() {
	drawCoordinateSystemGrid();
	xe = xe_0 + radius * Math.cos(angle);
	ye = radius * Math.sin(angle);
	ctx.beginPath();
	ctx.moveTo(xb, yb);
	ctx.lineTo(xe, ye);
	ctx.stroke();
	angle = angle - d_angle;
	
	ctx.beginPath();
	ctx.arc(xe, ye, radiusDot*5, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#6699ff';
	ctx.fill();
	ctx.strokeStyle = '#6699ff';
	ctx.stroke();
	
	if(simulate){
		if(angle >= middle){
			p -= dt;
			setTimeout(drawLine_left_mid, p);
		}
		else if(d_angle>0){
			if(resistance){
				d_angle -= d2r(0.01);
			}
			angle = middle;
			drawLine_mid_right();
		}
		else{
			// change buttons options when pendulum ends swinging 			
			pendulumStopped();
		}
	}
	else{	
		drawCoordinateSystemGrid();
	}
}

// draws pendulum on the right place if motion goes from the middle to the left
function drawLine_mid_left() {
	drawCoordinateSystemGrid();
	xe = xe_0 + radius * Math.cos(angle);
	ye = radius * Math.sin(angle);
	ctx.beginPath();
	ctx.moveTo(xb, yb);
	ctx.lineTo(xe, ye);
	ctx.stroke();
	angle = angle + d_angle;
	
	ctx.beginPath();
	ctx.arc(xe, ye, radiusDot*5, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#6699ff';
	ctx.fill();
	ctx.strokeStyle = '#6699ff';
	ctx.stroke();
	
	if(simulate){
		if(angle <= minRight){
			p += dt;
			setTimeout(drawLine_mid_left, p);
		}
		else if(d_angle>0){
			angle = minRight;
			if(resistance){
				p*=1.01;
			}
			drawLine_left_mid();
			if(resistance){
				minRight -= d2r(3);
			}
		}
		else{	
			// change buttons options when pendulum ends swinging 
			pendulumStopped();
		}
	}
	else{	
		drawCoordinateSystemGrid();
	}
}

// draws pendulum on the right place if motion goes from the right to the middle
function drawLine_right_mid() {
	drawCoordinateSystemGrid();
	xe = xe_0 + radius * Math.cos(angle);
	ye = radius * Math.sin(angle);
	ctx.beginPath();
	ctx.moveTo(xb, yb);
	ctx.lineTo(xe, ye);
	ctx.stroke();
	angle = angle + d_angle;
	
	ctx.beginPath();
	ctx.arc(xe, ye, radiusDot*5, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#6699ff';
	ctx.fill();
	ctx.strokeStyle = '#6699ff';
	ctx.stroke();
	if(simulate){
		if(angle <= middle){
			p -= dt;
			setTimeout(drawLine_right_mid, p);
		}
		else if(d_angle>0){
			if(resistance){
				d_angle -= d2r(0.01);
			}
			angle = middle;
			drawLine_mid_left();
			if(resistance){
				minLeft += d2r(3);
			}
		}
		else{
			// change buttons options when pendulum ends swinging 
			pendulumStopped();
		}
	}
	else{	
		drawCoordinateSystemGrid();
	}
}


var startB = document.getElementById("startButton");
var stopB = document.getElementById("stopButton");


// starts simulation of a pendulum montion
function start()
{
	// check which option is checked montion with resistance or not
	if(document.getElementById('withResistance').checked == true)
		resistance = true;
	
	// if user starts simulation-->won't be able to change the resistance option
	document.getElementById("withoutResistance").disabled=true;
	document.getElementById("withResistance").disabled=true;
	
	startB.classList.remove(startB.classList.item(0));
	startB.classList.add("buttons");
	stopB.classList.remove(stopB.classList.item(0));
	stopB.classList.add("startButton");


	stopB.disabled = false;
	startB.disabled = true;
	simulate = true;
	
	p = 20;
	dt = 1;
	d_angle = d2r(1);
	minLeft = d2r(30);
	middle = d2r(90);
	minRight = d2r(150);
	angle = minLeft;
	xe = xe_0-radius;
	ye = ye_0-radius;
		
	drawLine_right_mid();
}

// stops simulation
function stop()
{
	// if user stops the simulation-->is able to change the resistance option
	pendulumStopped();
	
	simulate = false;
}


// refreash page every time window resizing
window.onresize = function()
{
	setTimeout(() => window.location.reload());	
}


// calculates the period of a simple pendulum
function count() {
	if (document.getElementById("grav").value <= 0 || document.getElementById("grav").value === "" || isNaN(document.getElementById("grav").value) === true || document.getElementById("len").value <= 0 || document.getElementById("len").value === ""  || isNaN(document.getElementById("len").value) === true){
		document.getElementById("result").style.fontSize = "13px"; 
		document.getElementById("result").innerHTML = "Popraw dane!";
		return false;
	} else {
		var l = document.getElementById("len").value;
		var g = document.getElementById("grav").value;
		var resultValue = 2 * Math.PI * Math.sqrt(l/g);
		document.getElementById("result").style.fontSize = "18px"; 
		document.getElementById("result").innerHTML = "T=" + Math.round(resultValue * 10000) / 10000 + "s";
	}
}

// adds zero if value < 10
function addZero(val) {
  return val < 10 ? "0" + val : val;
}


// displays current time
function clockCurrentTime() {
	var currentTime = new Date();
	var h = currentTime.getHours();
	var min = currentTime.getMinutes();
	var sec = currentTime.getSeconds();
	var temp_h = h-12;
	var am_pm = h < 12 ? h : temp_h;
	h = addZero(h);
	min = addZero(min);
	sec = addZero(sec);
	var timeStr = `${h} : ${min} : ${sec}`;
	document.getElementById("clock").innerText = timeStr;
	var timer = setTimeout(clockCurrentTime, 1000);
}

clockCurrentTime()