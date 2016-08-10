(function ( $ ) {

	$.fn.knob = function(options) {

		 // This is the easiest way to have default options.
		 var settings = $.extend({
		 	borderBackground: "#EFEFEF",
		 	borderColor: "#00897B",
		 	lineWidth: 15,
		 	radius: 60,
		 	centerX: 100,
		 	centerY: 100,
		 	degree: 90,
		 	text: ""
		 }, options );

		 var container = this;
		 var canvas = $('<canvas/>',{'class':'radHuh'})[0];
		 var context = canvas.getContext('2d');
		 var borderBackground = settings.borderBackground;
		 var borderColor = settings.borderColor;
		 var radius, centerX ,centerY;
		 var lineWidth = settings.lineWidth;
		 var degree = settings.degree;
		 var text = settings.text;

		 var counter = {
		 	counter : 1,
		 	getCounter : function(){
		 		this.counter += 1;
		 		return this.counter;
		 	},
		 	resetCounter : function(){
		 		this.counter = 1;
		 	}
		 };

		 var degreeToRadial = function(degree){
		 	return (Math.PI/180)*degree;
		 };

		 var calculate = function(){
		 	canvas.width = container.width();
		 	canvas.height = canvas.width;
		 	radius = canvas.width/2 - lineWidth/2;
		 	centerX = canvas.width/2;
		 	centerY = canvas.height/2;
		 	radius = radius > 0 ? radius : 0;
		 };

		 var clearCanvas = function(){
		 	context.clearRect(0, 0, canvas.width, canvas.height);
		 };

		 var drawBackgroundCircle = function(){
		 	clearCanvas();
		 	context.beginPath();
		 	context.arc(centerX, centerY, radius, 0 , 2*Math.PI, false);
		 	context.strokeStyle = borderBackground;
		 	context.lineWidth       = lineWidth;
		 	context.stroke();
		 };

		 var drawDataCircle = function(resize){
		 	drawBackgroundCircle();
		 	var resize = Boolean(resize);
		 	var count = counter.getCounter();
		 	var angle = resize ? degree : count;
		 	context.beginPath();
		 	context.strokeStyle = borderColor;
		 	context.lineWidth       = lineWidth;
		 	context.arc(centerX, centerY, radius, -degreeToRadial(90) , degreeToRadial(angle - 90), false);
		 	context.stroke();
		 	if(count < degree){
		 		setTimeout(drawDataCircle, 10);
		 	}
		 	else if(count === degree){
		 		drawDataCircle(false);
		 		new ResizeSensor(container[0], function(){
		 			console.log("change");
		 			drawCanvas(true);
		 	});
		 	}
		 	else{
		 		drawData(text);
		 	}
		 };

		 var drawData = function(text){
		 	var diff = text.toString().length * 3;
		 	context.beginPath();
		 	context.font = "14px Georgia";
		 	context.textAlign='center';
		 	context.fillText(text, centerX, centerY);
		 	context.stroke();
		 };

		 var drawCanvas = function(resize){
		 	calculate();
		 	drawDataCircle(resize);
		 };

		 container.append(canvas);
		 drawCanvas(false);
		 
		 // var ele = this;
		 // var knob = {
		 // 	canvas : ele[0],
		 // 	context : this.canvas.getContext('2d'),
		 // 	lineWidth : parseInt(canvas.getAttribute('weight')) || 10,
		 // 	ratio : 1,
		 // 	radius : parseInt(canvas.getAttribute('radius')) || 50,
		 // 	drawBackground : "gray",
		 // 	degree : Math.PI/180,
		 // 	angle : 167
		 // };
		 // ele[canvas] = ele[0];
		 // var canvas = ele[0];
		 // console.log(canvas);
		 // var context = canvas.getContext('2d');
		 // console.log(context);
		 // var lineWidth = parseInt(canvas.getAttribute('weight')) || 10;
		 // var ratio               = 1;
		 // var radius 	= parseInt(canvas.getAttribute('radius')) || 50;
		 // var borderBackground = "gray";
		 // var deg                 = Math.PI/180;
		 // var angle 	= 167;

		 // var calculate = function(){
   //          context.lineWidth       = lineWidth; // default

   //          ratio  = 300/canvas.offsetWidth;
   //          radius = radius || (canvas.offsetHeight/2-context.lineWidth);

   //          centerX = canvas.offsetWidth*ratio / 2;
   //          centerY = canvas.offsetHeight*ratio / 2;
   //      };

   //      var drawBackground = function(){
   //      	context.clearRect(0, 0, canvas.width, canvas.height);
   //      	context.beginPath();
   //      	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
   //      	context.strokeStyle = borderBackground;
   //      	context.stroke();
   //      };

   //      var drawSection = function(){
   //      	calculate();
   //      	drawBackground();
   //      	context.beginPath();
   //      	context.arc(centerX, centerY, radius, -90 * deg, (-90+ angle) * deg, false);
   //      	context.strokeStyle = "blue";
   //      	context.stroke();
   //      };
   //      drawSection();

};

}( jQuery ));
