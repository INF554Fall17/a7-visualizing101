
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function renderBarChart(){
    

    updateBarChart();
    
}


function updateBarChart(filter){


      d3.csv("../data/Cancer_Stats.csv", function(row){
        for(var key in row){
            if(key!="Countries")
                row[key]= +row[key];
        }
        return row;
},function(error, data) {
//  console.log(data);
var countryName = "Total";


if(filter!=null){
    countryName=filter;
}

  data = data.filter(function(d){
      return d["Countries"] == countryName;
  })
 
delete data[0]["Countries"];
var dataArr=[];
var dataYear=[];
  for(key in data[0]){
      dataArr.push(data[0][key]);
      dataYear.push(key);
  }

      var height = 500;
      var width = 900;
      var barPadding = 2;
      var barWidth = (width / dataArr.length) - barPadding;

      var yScale = d3.scaleLinear()
          .domain([0, d3.max(dataArr)])
          .range([0, height]);


      var xScale = d3.scaleBand()
  .domain(dataArr)
  .range([0, width]);

  var yAxisBar = d3.axisLeft(yScale).tickFormat(function (d){
             return d3.format(".1f")(d/10);});


      var svg = d3.select("#myDiv")
          .style('width', (width+300) + 'px')
          .style('height', height + 'px');

      var selection = svg.selectAll("rect").data(dataArr,function(d){return d[Object.keys(d)[0]]});

        selection.exit().remove();
      svg.selectAll('rect')
          .data(dataArr)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr("x", function (d, i) {
              return xScale(d);
          })
          .attr("y", function (d, i) {
              return height;
          })
          .attr("width", 24)
          .attr("fill", function(d, i){ console.log(i);return fillBarColor(i);})
          .on("mouseover", function(d,i) {


                  var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                  var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;


                  d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")
                      .select("#value")
                      .text(d)

                  d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")
                      .select("#value2")
                      .text(dataYear[i])
                      


                  d3.select("#tooltip").classed("hidden", false);

             }).on("mouseout", function() {


                  d3.select("#tooltip").classed("hidden", true);

             })
          .attr("height", 0)
          .transition()
          .duration(200)
          .delay(function (d, i) {
              return i * 50;
          })
          .attr("y", function (d, i) {
              return height - yScale(d) - 25;
          })
          .attr("height", function (d, i) {
              return yScale(d);
          })
          var svg = d3.select("#myDiv")
          
          var quantize = d3.scaleQuantize()
          .domain([ 1979, 2014 ])
          .range(d3.range(7).map(function(i) { return "q" + i + "-9"; }));
          
  
          svg.selectAll(".legendQuant").remove();

          svg.append("g")
          .attr("id","BarLegend")
          .attr("class", "legendQuant")
          .attr("transform", "translate(950, 15)");
            
              var legend = d3.legendColor()
              .labelFormat(d3.format(".0f"))
              .useClass(true)
              .title("Time period")
              .titleWidth(100)
              .scale(quantize);
              svg.select(".legendQuant")
              .call(legend);
         
          
          

         
         
        
        
          
        
          
         

  function fillBarColor(i){
if(i <= 5){
  return "rgb(198,219,239)";
}
if(i > 5 && i <= 10){
  return "rgb(158,202,225)";
}
if(i > 10 && i <= 15){
  return "rgb(107,174,214)";
}
if(i > 15 && i <= 20){
  return "rgb(66,146,198)";
}
if(i > 20 && i <= 25){
  return "rgb(33,113,181)";
}
if(i > 25 && i <= 30){
  return "rgb(8,81,156)"; 
}
if(i > 30 && i <= 36){
  return "rgb(8,48,107)";
}
}

}); 
    }


//Feed Data
