	var min = 25; //min frequency
	
	//data lists
	var combinedData = new Array(),
		donneData,
		shakeData;
	
	//initialize variables
	var arr = new Array(), 
		nodes = new Array(),
		vis = null,
		circles = null;
	
	//pack layout	
	var bubble = d3.layout.pack()
	      .nodes([nodes]);
		
	//pack size & text format
	var r = 800,
	 	w = 940,
		h = 600,
	    format = d3.format(",d");
	
	//force locations
	var center = {x: w/2, y: h/2},
		center_shake = {x: w/3, y: h/2},
		center_donne = {x: w/2, y: h/2},
		center_both = {x: 2 * w/3, y: h/2};
		
	//force gravity
	var layout_gravity = -0.01,
		damper = 0.1;
	
	//color      
	var fill = d3.scale.ordinal()
	    .domain(["shake", "donne", "both"])
	    .range(colorbrewer.RdBu[9]);
	    //.range(["#d84b2a", "#beccae", "#7aa25c"])      

	function getData() {
		var deferred = $.Deferred();
		
		$.when(function() {
			d3.json("donneTf.json", function(json) {
				 	var author = "donne";
					donneData = highFreq(json,author);
				});
			
			d3.json("shakeTf.json", function(json) {
				 	var author = "shakespeare";
					shakeData = highFreq(json,author);
				});	
			})
			.then( function() { 
				console.log(donneData);
				merge(donneData,shakeData);
			});	
		return deferred;
	}         
  
	function createNodes(data) {
			for (var key in data) {
				node = {
					//id: i++;
					word: data[key]['word'],
					freq: data[key]['freq'],
					author: data[key]['author'],
					r: scaleBubbles(data[key]['freq']),
					x: Math.random() * r,
					y: Math.random() * r		
				};
				nodes.push(node);		
		}
				//console.log(nodes);
	}
	//console.log(nodes);
	function createVis() {
	//attach svg node  
		var vis = d3.select("#chart").append("svg")
			.attr("width", r)
	     	.attr("height", r)
	     	.attr("class", "bubble");
	     	
	//attach each g node     	
	     var circles = vis.selectAll("g")
	     	.data(bubble.nodes[nodes])
	     	.enter().append("g")
	     	.attr("class", "node")
	     	.attr("fill", function(d) { return fill(d.author); });	
	     	
	console.log(circles);     	       				
	}
	
	      
	
	/*
	function createVis() {
			       .attr("transform", function(d) { return "translate(" + x + "," + y + ")"; });
					node.append('title').text(function(d) { 
		       			return obj['author'] + ": " + format(obj['freq']); });
		       		node.append("circle")
		       			.attr("r", function(d) { radius = scaleBubbles(obj['freq']); return radius;  })
			       	node.append("text")
				       .attr("text-anchor", "middle")
				       .attr("dy", ".3em")
				       .text(function(d) { return obj['word']; }); 
			}  
	
	*/
	      
	function merge(donneData,shakeData) {
		//console.log(donneData);
		//console.log(shakeData);
	
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
	
	function adjustedFreq(freq) {
			this.author="both";
			//this freq=;
	}


bubbleMatic = new getData();
bubbleMatic.then(
	function (donneData, shakeData, combinedData) {					
		console.log("bubbleMatic");									
});