$(document).ready(function () {
	var button = document.getElementById("artButton");
	var canvas = document.getElementById('artCanvas');  
		if (canvas.getContext){  
    		var ctx = canvas.getContext('2d'); 
    	}
	artHandler(canvas,ctx);

});

function artHandler(canvas,ctx) {
	fillBackgroundColor(canvas,ctx);
	var title = makeTitle();
	addTitle(title);
	
	for (i = 0; i<=numberShapes(); i++) {
		randomShape(canvas,ctx);	
	}
	
	//choose random background color
	//choose random colors for each shape
	//build random shapes on canvas
	//add title to canvas display
	
}

function makeTitle() {
	//randomly generate phrase from arrays of words
	var titles = [
		"Polar bear!",
	  	"North Pole madness",
	  	"I did a terod",
	  	"Drunken bear"
	 	];
	  
  	var rand = Math.floor(Math.random() * titles.length); 
  	var title = titles[rand];
  	return(title);
}

function fillBackgroundColor(canvas,ctx) {
	ctx.fillStyle = chooseColor();
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

function chooseColor() {
	//make random color
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function numberShapes() {
	var num = 10;
  	var rand = Math.floor(Math.random() * num); 
	return rand;
}

function randomShape(canvas,ctx) {
	//randomly choose shapes shape for the canvas
	var shapes = [
		"triangle",
		"square",
		"circle"
	];
  	var rand = Math.floor(Math.random() * shapes.length); 
  	var shape = shapes[rand];
  	if (shape === "triangle") { makeTriangle(canvas,ctx); }
  	if (shape === "square") { makeSquare(canvas,ctx); }
  	if (shape === "circle") { makeCircle(canvas,ctx); }
	
}

function makeCircle(canvas,ctx) {
	var rad = Math.floor(Math.random() * 50); 
	[x,y] = startPosition(canvas,ctx);
	var w = Math.PI*2;
	ctx.beginPath();
	ctx.arc(x,y,rad,w,true);  
	ctx.fillStyle = chooseColor();
	ctx.fill();
}

function makeTriangle(canvas,ctx) {
	//make a triangle
	[x,y] = startPosition(canvas,ctx);	
			ctx.beginPath();  
			ctx.moveTo(x,y);  
	[x,y] = startPosition(canvas,ctx);	
			ctx.lineTo(x,y);  
	[x,y] = startPosition(canvas,ctx);	
			ctx.lineTo(x,y);  
			ctx.fill();  
  			
}

function makeSquare(canvas,ctx) {
	//make a square
	[x,y] = startPosition(canvas,ctx);	  
		    ctx.fillRect(x,y,100,100);  
	[x,y] = startPosition(canvas,ctx);	  
		    ctx.clearRect(x,y,60,60);  
	[x,y] = startPosition(canvas,ctx);	  
		    ctx.strokeRect(x,y,50,50);  	

}

function startPosition(canvas,ctx) {
	
	var x = Math.floor(Math.random() * canvas.width); 
	var y = Math.floor(Math.random() * canvas.height); 
	return [x,y];

}

function addTitle(title) {
	//add title to display
	console.log(title);
	var canvas = document.getElementById('artCanvas');
	if (canvas.getContext){  
    	var ctx = canvas.getContext('2d');  
		 
		ctx.fillStyle = chooseColor();
		ctx.font = "bold 1em sans-serif";
		ctx.textAlign = "right";
		ctx.fillText(title,canvas.width-20, canvas.height-20);
	}	
}
