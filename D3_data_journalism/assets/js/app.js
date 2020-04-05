// @TODO: YOUR CODE HERE!
// set the dimensions and margins of the graph
//https://www.d3-graph-gallery.com/graph/scatter_basic.html
//16-D3/2/10-Stu_LineChart/Solved/app.js

d3.csv("assets/data/data.csv").then(function(healthdata){
    var svgWidth = 1000;
    var svgHeight = 600;
    var margin = {
        top: 40,
        bottom: 90,
        right: 40,
        left: 90
    };
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
    //create SVG that holds the chart 
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    //shift 
    var chartGroup = svg.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    //import data 
    healthdata.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        //data.smokes = +data.smokes;
        //data.age = +data.age;
        //console.log(data.poverty);
        
        
    });
    //set up scales
    var xScale = d3.scaleLinear()
        //make most of data show up in the middle region   
        .domain([d3.min(healthdata,data=>data.poverty)-3,d3.max(healthdata,data=>data.poverty)+2])
        .range([0,width]);
    var yScale = d3.scaleLinear()
        .domain([0,d3.max(healthdata,data=>data.healthcare)])
        .range([height,0]);

    //X-axis 
    //Y-axis
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    //https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    chartGroup.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    chartGroup.append('g')
        .call(yAxis);
    //define the div for the tooltip 
    //https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    var div = d3.select('#scatter').append('div')
        .attr('class','tooltip')
        .style('opacity',0);
    //add Circles from data 
    var Circles = chartGroup.selectAll("circle")
        .data(healthdata)
        .enter()
        .append("circle")
        .attr('cx',(data=>xScale(data.poverty)))
        .attr('cy',(data=>yScale(data.healthcare)))
        .attr('r','15')
        .attr('fill','blue')
        .attr('opacity','.5')
        //.attr('stroke','black')
        //.attr('stroke-width',1)
        .on('mouseover',function(d){
            div.transition()
                .duration(200)
                .style('opacity',1);
            div.html(d.state+"<br/>"+"healthcare(%):"+d.healthcare)
                .style("left", (d3.event.pageX-100) + "px")		
                .style("top", (d3.event.pageY-50) + "px");
            })
        .on('mouseout',function(d){
            div.transition()
                .duration(500)
                .style('opacity',0);
        })

    //Add text labels to circles 
    //state abbreviation show up on the circle 
    //https://github.com/Automedon/freeCodeCmap-D3/blob/master/Data%20Visualization%20with%20D3:%20Add%20Labels%20to%20Scatter%20Plot%20Circles
    //https://stackoverflow.com/questions/13615381/d3-add-text-to-circle
    chartGroup.selectAll("text")
        .data(healthdata)
        .enter()
        .append("text")
        .attr('x',(data=>xScale(data.poverty)))
        .attr('y',(data=>yScale(data.healthcare)))
        .style('fill','black')
        .style('font-size','10px')
        .style('text-anchor','middle')
        //move around text to the center of circles
        //.attr("dx", function(d){return -7})
        .text(data=>data.abbr);

    //https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Healthcare %"); 
    //add x labels  
    svg.append("text") 
        //use svgwidth to make label in the center             
        .attr("transform",
              "translate(" + (svgWidth/2) + " ," + 
                             (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Poverty %");     

}).catch(function(error){
    console.log(error);
});


