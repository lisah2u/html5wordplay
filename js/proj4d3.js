var min = 25; //min frequency
var combinedData = new Array(); 
var donneData;
var shakeData;

$(document).ready(function () {

var arr = new Array(); 

//pack size & text format
var r = 800,
      format = d3.format(",d");

//color      
var fill = d3.scale.ordinal()
    .domain(["shake", "donne", "both"])
    .range(colorbrewer.RdBu[9]);
    //.range(["#d84b2a", "#beccae", "#7aa25c"])      

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
	 	//donneData = combine(json);
		donneData = highFreq(json,author);
		createNodes(donneData);  
    
	});

d3.json("shakeTf.json", function(json) {
	 	var author = "shakespeare";
	 	//shakeData = combine(json);
		shakeData = highFreq(json,author);
		createNodes(shakeData);  
    
	});    
  

function createNodes(data) {

		for (var key in data) {
		   var obj = data[key];
			    var rad = 10;                  
				var x = Math.random() * r;
			    var y = Math.random() * r;
				//console.log(obj['word'],obj['freq'],obj['author']);

				var node = vis
				.selectAll("g-node")
				.data([obj])
				.enter()
				.append("g")
			   .attr("class", "node")
		       .attr("transform", function(d) { return "translate(" + x + "," + y + ")"; });
				node.append('title').text(function(d) { 
	       			return obj['author'] + ": " + format(obj['freq']); });
	       		node.append("circle")
	       			.attr("r", function(d) { radius = scaleBubbles(obj['freq']); return radius;  })
	       			.style("fill", function(d) { 
		       				return fill(d.author); });	       				
		       	node.append("text")
			       .attr("text-anchor", "middle")
			       .attr("dy", ".3em")
			       .text(function(d) { return obj['word']; }); 
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
					if (json[key] >= min) {
				    	arr.push(objWord);
					}	
			    };
		return arr; 	    		    
}

function scaleBubbles(freq) {
	return freq/2;
}

function adjustedFreq(freq)
	{
		this.author="both";
		//this freq=;
}

});

