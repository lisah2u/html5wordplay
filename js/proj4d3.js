var min = 15; //min frequency

$(document).ready(function () {

var arr = new Array(); 

//pack size & text format
var r = 800,
      format = d3.format(",d");

//color      
var fill = d3.scale.ordinal()
    .domain(["shake", "donne", "both"])
    //.range(colorbrewer.RdBu[9]);
    .range(["#d84b2a", "#beccae", "#7aa25c"])      

//pack layout 
var bubble = d3.layout.pack()
      .sort(null)
      .size([r, r]);
  
//attach svg node  
var vis = d3.select("#chart").append("svg")
     .attr("width", r)
     .attr("height", r)
     .attr("class", "bubble");
     
d3.json("donneTf.json", function(json) {
	 	var author = "donne";
		donneData = highFreq(json,author);
		createNodes(donneData);  
    
	});

d3.json("shakeTf.json", function(json) {
	 	var author = "shakespeare";
		shakeData = highFreq(json,author);
		createNodes(shakeData);  
    
	});    


function createNodes(data) {

		for (var key in data) {
		   var obj = data[key];
		   for (var prop in obj) {
			    var rad = 10;                  //TODO scale radius
				var x = Math.random() * r;
			    var y = Math.random() * r;
				//console.log(obj['word'],obj['freq'],obj['author']);

				var node = vis
				.selectAll("g-node")
				.data([obj])
				.enter()
				.append("g")
			   .attr("class", "node")
		       .attr("transform", function(n) { return "translate(" + x + "," + y + ")"; });
				node.append('title').text(function(n) { 
	       			return obj['word'] + ": " + format(n.value); });
	       		node.append("circle")
	       			.attr("r", function(n) { return rad; })
	       			.style("fill", function(n) { 
		       				return fill(n.author); });	       				
		       	node.append("text")
			       .attr("text-anchor", "middle")
			       .attr("dy", ".3em")
			       .text(function(n) { return obj['word']; }); 
	   		}
		}  
}      


function highFreq(json,author) {
		var i = 0;	
		var arr = new Array(); 
		
		for (var key in json) {	    
				var objWord = {
			        word: key,
			        freq: json[key],
			        author: author }
				//objWord = checkDuplicate();
					if (json[key] >= min) {
				    	arr.push(objWord);
					}	
			    };
		return arr; 	    		    
}

//TODO 
function checkDuplicate(obj) {
	return obj;
}

//TODO - adjust for scaling
function adjustedFreq(freq)
	{
		this.author="both";
		//this freq=;
}

});

