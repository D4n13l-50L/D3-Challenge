// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG, append it to make
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 50);

// Append  SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



  // Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";



// funtion for x update
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// funtion for y update
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis])-2,d3.max(data, d => d[chosenYAxis])+2])
      .range([height, 0]);
  
    return yLinearScale;
  
}

// function or update  xAxis
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(500)
      .call(bottomAxis);
  
    return xAxis;
}

// function for update yAxis 
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(500)
      .call(leftAxis);
  
    return yAxis;
}
//Circles///////////////////////////////////////////////////////////////
// functions circles grouping
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(500)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}
//  circles for y
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(500)
      .attr("cy", d => newYScale(d[chosenYAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis])+5)
  
    return circlesGroup;
}
//  text location transition 
function renderXText(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(800)
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}
function renderYText(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(500)
      .attr("dy", d => newYScale(d[chosenYAxis])+5)
  
    return circlesGroup;
}
/////////////////////////////////////////////////////////////////////


// for updating circles group 
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty:";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age:";
    }
    else if (chosenXAxis === "income"){
        xlabel = "Household income:"
    }

    if (chosenYAxis === 'healthcare'){
        ylabel = "Health:"
    }
    else if (chosenYAxis === 'obesity'){
        ylabel = "Obesity:"
    }
    else if (chosenYAxis === 'smokes'){
        ylabel = "Smokes:"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("color", "black")
      .style("background", 'white')
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
    .on("mouseout", function(data, index) {
    toolTip.hide(data);
    });
  
    return circlesGroup;
}
/////////////////DATA///////////////////////////////////////
// for getting data from the CSV 
d3.csv("assets/data/data.csv").then(function(data, err) {
    // console.log(data)
    if (err) throw err;
  
    // parse data
    data.forEach(d => {
      d.poverty = +d.poverty;
      d.povertyMoe = +d.povertyMoe;
      d.age = +d.age;
      d.ageMoe = +d.ageMoe;
      d.income = +d.income;
      d.incomeMoe = +d.incomeMoe;
      d.healthcare = +d.healthcare;
      d.healthcareLow = +d.healthcareLow;
      d.healthcareHigh = +d.healthcareHigh;
      d.obesity = +d.obesity;
      d.obesityLow = +d.obesityLow;
      d.obesityHigh = +d.obesityHigh;
      d.smokes = +d.smokes;
      d.smokesLow = +d.smokesLow;
      d.smokesHigh = +d.smokesHigh;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(data, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("g");

    var circles = circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .classed('stateCircle', true);

    // append text inside circles
    var circlesText = circlesGroup.append("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis])+5) //to center the text in the circles
      .classed('stateText', true);
  
    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var PovertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var AgeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var IncomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
    
    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
    
    var ObeseLabel = ylabelsGroup.append("text")
      .attr("y", -80)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");
  
    var SmokesLabel = ylabelsGroup.append("text")
      .attr("y", -60)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

    var HealthLabel = ylabelsGroup.append("text")
      .attr("y", -40)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circles = renderXCircles(circles, xLinearScale, chosenXAxis);

        //   updating text within circles
          circlesText = renderXText(circlesText, xLinearScale, chosenXAxis)  
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  

        }
      });

      // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circles = renderYCircles(circles, yLinearScale, chosenYAxis);

        // update text within circles
        circlesText = renderYText(circlesText, yLinearScale, chosenYAxis) 


      }
    });
  }).catch(function(error) {
    console.log(error);
  });