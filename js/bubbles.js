var data = []
data.push({"x": Math.random(), "y": Math.random(), "beasts": 6})
data.push({"x": Math.random(), "y": Math.random(), "beaten": 2})
data.push({"x": Math.random(), "y": Math.random(), "beauteous": 5})
data.push({"x": Math.random(), "y": Math.random(), "beauty": 23})

var h = 500
var vis = d3.select("div")
    .append("svg:svg")
    .attr("width", 500)
    .attr("height", 500)
    
var x = d3.scale.linear().domain([0,1]).range([screen.width / 2 - 400,screen.width / 2 + 400]),
y = d3.scale.linear().domain([0,1]).range([0,h]),
c = d3.scale.linear().domain([0,1]).range(["hsl(250, 50%, 50%)","hsl(350, 100%, 50%)"]).interpolate(d3.interpolateHsl)
r = d3.scale.linear().domain([0,1]).range([5,10]),
     
vis.selectAll("circle")
    .data(data)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
//    .attr("visibility", "hidden")
    .attr("r", function() { return r(Math.random()) })
    .on("mouseover", function() {

        d3.select(this).transition()
        .attr("cy", function() { return y(Math.random()) })
        .delay(0)
        .duration(2000)
        .ease("elastic", 10, .3)
    })        