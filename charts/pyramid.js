function renderPyramidChart(){	
	var margin = {top: 0, bottom: 0, left: 0, right: 0},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    svg = d3.select("#pyramidChart")

     ,
    t = d3.transition()
        .duration(750),
    x_scale_male = d3.scaleLinear()
        .range([0, (width /2)]),
    x_scale_female = d3.scaleLinear()
        .range([0, (width /2)]),
    y_scale = d3.scaleBand()
        .rangeRound([0, height])
        .padding(.3);

     // var headersvg =  svg2.append("div")

     //    headersvg.append("img")
     //        .attr("src","../images/female.png")
     //        .attr("width", "90px")
     //        .attr("height", "100px")
     //        .attr("align", "left")

     //        headersvg.append("img")
     //        .attr("src","../images/male.png")
     //        .attr("width", "80px")
     //        .attr("height", "100px")
     //        .attr("align", "right")
        
      var svg =      svg.append("svg")
      .attr("id","viz")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            
    svg.append("image")
    .attr("xlink:href","../images/female.png").attr("height", "90px").attr("width", "90px").style("opacity",0.6)
    .attr("x", (width / 2)-400  )
    .attr("y", 20)
    ;

svg.append("image")
    .attr("xlink:href","../images/male.png").attr("height", "100px").attr("width", "100px").style("opacity",0.6)
    .attr("x", (width / 2)+250  )
    .attr("y", 20)
    ;

d3.queue()
    .defer(d3.csv, "charts/pyramidData.csv")
    .await(ready);

    renderHorizontalChart();
}

function ready(error, data){

    // types
    var number_columns = ["year","index","typeOfCancer","total_males","total_females","M0-14","M15-29","M30-49","M50-59","M60-69","M70+","F0-14","F15-29","F30-49","F50-59","F60-69","F70+"];

    data.forEach(function(d){

        number_columns.forEach(function(col){
            if(col!="typeOfCancer")
                d[col] = +d[col];

        });

        return d;

    });

    var margin = {top: 0, bottom: 0, left: 0, right: 0},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    svg = d3.select("#viz")

     ,
    t = d3.transition()
        .duration(750),
    x_scale_male = d3.scaleLinear()
        .range([0, ((width-150) /2)]),
    x_scale_female = d3.scaleLinear()
        .range([0, ((width) /2)]),
    y_scale = d3.scaleBand()
        .rangeRound([0, height-55])
        .padding(.3);

    // y domain
    y_scale.domain(data.map(function(d){ return d.index; }));

    // dropdowns

    // unique area names
    var area_names = _.chain(data).pluck("year").uniq().value().sort();

    area_names.forEach(function(d){
        $("#dropdowns #area_name").append("<option>" + d + "</option>")
    });
    
   /* var tru_options = [{
        id: "total",
        name: "Total"
    },{
        id: "rural",
        name: "Rural"
    },{
        id: "urban",
        name: "Urban"
    }];
    tru_options.forEach(function(d){
        $("#dropdowns #tru").append("<option value='" + d.id + "'>" + d.name + "</option>")	;
    });
*/
    redraw(data, "total");

   /* $("select").change(function(d){

        redraw(filter_data(data, $("#dropdowns #area_name").val()), $("#dropdowns #tru").val());

    });*/

    // filters the data based on a value from the area dropdown
   /* function filter_data(data, value){

        return data.filter(function(d){
            return d.year == value;
        })

    }*/

    // tru must be "total", "rural", or "urban"
    function redraw(data, tru){
        
        // sort data by age
        data = _.sortBy(data, "index");

        data = data.reverse();
        // update x scales
        var max_male = d3.max(data, function(d){ return d[tru + "_males"]; }),
            max_female = d3.max(data, function(d){ return d[tru + "_females"]; }),
            max = d3.max([max_male, max_female]);

        x_scale_male.domain([0, max]);
        x_scale_female.domain([0, max]);


      

        // JOIN
        var male_bar = svg.selectAll(".bar.male")
                .data(data, function(d){ return d.index; })
                ;

        var female_bar = svg.selectAll(".bar.female")
                .data(data, function(d){ return d.index; });

        var label_bar = svg.selectAll(".bar.label")
                .data(data, function(d){ return d.index; });

        // EXIT
        male_bar.exit().remove();
        female_bar.exit().remove();
        label_bar.exit().remove();
        // UPDATE
        male_bar
            .transition(t)
                .attr("width", function(d){ return x_scale_male(d[tru + "_males"]); });

        female_bar
            .transition(t)
                .attr("x", function(d){ return width / 2 - x_scale_female(d[tru + "_females"]); })
                .attr("width", function(d){ return x_scale_female(d[tru + "_females"]); });

        // ENTER
        male_bar.enter()
            .append("rect")
                .attr("class", "bar male")
                .attr("x", (width / 2)+50)  
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("width", function(d){ return x_scale_male(d["M0-14"]); })  
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(158,202,225)");
                
        male_bar.enter().
            append("rect")
                .attr("class", "bar male")
                .attr("x",function(d){ return (width / 2)+x_scale_male(d["M0-14"])+50})
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); }) 
                .attr("width", function(d){ return x_scale_male(d["M15-29"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(107,174,214)");

        male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+x_scale_male(d["M0-14"])+ x_scale_male(d["M15-29"])+50})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M30-49"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(66,146,198)");

              male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+x_scale_male(d["M0-14"])+x_scale_male(d["M15-29"])+ x_scale_male(d["M30-49"])+50})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M50-59"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(33,113,181)");
              male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+x_scale_male(d["M0-14"])+x_scale_male(d["M15-29"])+x_scale_male(d["M30-49"])+ x_scale_male(d["M50-59"])+50})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M60-69"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(8,81,156)");
                  
                 male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+x_scale_male(d["M0-14"])+x_scale_male(d["M15-29"])+x_scale_male(d["M30-49"])+ x_scale_male(d["M50-59"])+x_scale_male(d["M60-69"])+50})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M70+"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(8,48,107)");
                  

        label_bar.enter().append("text")
                 .attr("class","pyramid_details")
                 .attr("x",(width/2)-20)
                 .attr("y",function(d){ return y_scale(d.index)+15; })
                 .attr("text-anchor","middle")
                 .style("fill", "white")
                 .text(function(d){return d.typeOfCancer;})
        
         d3.selectAll('.pyramid_details').call(pyramidDetailsChart);

        female_bar.enter().append("rect")
                .attr("class", "bar female")
               // .attr("x", function(d){ return (width / 2)-80; })
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); }) 
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-100; })                
                .attr("width", function(d){ return x_scale_female(d["F0-14"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(158,202,225)");
        
        female_bar.enter().append("rect")
                .attr("class", "bar female")
                //.attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-100 - x_scale_female(d["F15-29"]); })
                .attr("width", function(d){ return x_scale_female(d["F15-29"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(107,174,214)");

        female_bar.enter().append("rect")
                .attr("class", "bar female")
               // .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-100 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]); })
                .attr("width", function(d){ return x_scale_female(d["F30-49"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(66,146,198)");

        female_bar.enter().append("rect")
                .attr("class", "bar female")
               // .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"])- x_scale_female(d["F30-49"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-100 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]) - x_scale_female(d["F50-59"]); })
                .attr("width", function(d){ return x_scale_female(d["F50-59"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(33,113,181)");

         female_bar.enter().append("rect")
                .attr("class", "bar female")
              //  .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"])- x_scale_female(d["F30-49"])- x_scale_female(d["F50-59"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-100 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]) - x_scale_female(d["F50-59"])- x_scale_female(d["F60-69"]); })
                .attr("width", function(d){ return x_scale_female(d["F60-69"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(8,81,156)");

        female_bar.enter().append("rect")
                .attr("class", "bar female")
              //  .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"])- x_scale_female(d["F30-49"])- x_scale_female(d["F50-59"])- x_scale_female(d["F60-69"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-100 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]) - x_scale_female(d["F50-59"])- x_scale_female(d["F60-69"])- x_scale_female(d["F70+"]); })
                .attr("width", function(d){ return x_scale_female(d["F70+"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(8,48,107)");


    }

    function pyramidDetailsChart(selection){
        selection.on('click', function (data) {
            //console.log(data);
            d3.select('#cancerType').text(data["typeOfCancer"]);
            d3.select('#MaleCancerStats').text(data["total_males"]);
            d3.select('#FemaleCancerStats').text(data["total_females"]);
            d3.select('#totalPyramidDetails').style('visibility',"visible")
            .on('click',
        function(){
            var total=[
                {label:"M0-14",value:49782}
                ,{label:"M15-29",value:82643}
                ,{label:"M30-49",value:450612}
                ,{label:"M50-59",value:793304}
                ,{label:"M60-69",value:1267872}
                ,{label:"M70+",value:2338211}
                ,{label:"F0-14",value:36987}
                ,{label:"F15-29",value:69047}
                ,{label:"F30-49",value:496183}
                ,{label:"F50-59",value:616455}
                ,{label:"F60-69",value:820122}
                ,{label:"F70+",value:1742101}
            ];
            changePyramidHorizontalChart(total);
            d3.select('#totalPyramidDetails').style('visibility',"hidden");
            d3.select('#cancerType').text("All");
            d3.select('#MaleCancerStats').text("");
            d3.select('#FemaleCancerStats').text("");
        });
            var dataset = [];
           for( key in data){
               if(key.indexOf('M')==0||key.indexOf('F')==0){
               var label = key;
               var value = data[key];
               var d = {label,value};
               dataset.push(d);
               }
           }
           changePyramidHorizontalChart(dataset);
        });
    }
}









/*datasetTotal = [
    {label:"Category 1", value:19},
    {label:"Category 2", value:5},
    {label:"Category 3", value:13},
    {label:"Category 4", value:17},
    {label:"Category 5", value:21},
    {label:"Category 6", value:25}
];

datasetOption1 = [
    {label:"Category 1", value:22},
    {label:"Category 2", value:33},
    {label:"Category 3", value:4},
    {label:"Category 4", value:15},
    {label:"Category 5", value:36},
    {label:"Category 6", value:0}
];

datasetOption2 = [
    {label:"Category 1", value:10},
    {label:"Category 2", value:20},
    {label:"Category 3", value:30},
    {label:"Category 4", value:5},
    {label:"Category 5", value:12},
    {label:"Category 6", value:23}
];*/


d3.selectAll("input").on("change", selectDataset);

function selectDataset(dataset)
{
    
        change(datasetTotal);
    
}

function renderHorizontalChart(){
var total=[
    {label:"M0-14",value:49782}
    ,{label:"M15-29",value:82643}
    ,{label:"M30-49",value:450612}
    ,{label:"M50-59",value:793304}
    ,{label:"M60-69",value:1267872}
    ,{label:"M70+",value:2338211}
    ,{label:"F0-14",value:36987}
    ,{label:"F15-29",value:69047}
    ,{label:"F30-49",value:496183}
    ,{label:"F50-59",value:616455}
    ,{label:"F60-69",value:820122}
    ,{label:"F70+",value:1742101}
];
var margin = {
    top: (parseInt(d3.select('#pyramidChartBarChart').style('height'), 10)/20), right: (parseInt(d3.select('#pyramidChartBarChart').style('width'), 10)/20), bottom: (parseInt(d3.select('#pyramidChartBarChart').style('height'), 10)/20), left: (parseInt(d3.select('#pyramidChartBarChart').style('width'), 10)/5)},
        width = parseInt(d3.select('#pyramidChartBarChart').style('width'), 10) - margin.left - margin.right,
        height = parseInt(d3.select('#pyramidChartBarChart').style('height'), 10) - margin.top - margin.bottom;



var formatPercent = d3.format("");

var y = d3.scaleBand()
        .range([height, 0]);

var x = d3.scaleLinear()
        .range([0, width]);

var xAxis = d3.axisBottom(x).tickSize(-height);
        

var yAxis = d3.axisLeft(y);
//.tickFormat(formatPercent);

var svg = d3.select("#pyramidChartBarChart").append("svg")
        .attr("viewBox","0 0 "+(width + margin.left + margin.right+20)+" "+(height + margin.top + margin.bottom+39))
        .append("g")
        .attr("transform", "translate(" + (margin.left+10) + "," + (margin.top+30) + ")");

svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

//d3.select("input[value=\"total\"]").property("checked", true);
changePyramidHorizontalChart(total);
}

function changePyramidHorizontalChart(dataset) {
    var div = d3.select("#pyramidChartBarChart").append("div").attr("class", "toolTip");
    
    var margin = {
        top: (parseInt(d3.select('#pyramidChartBarChart').style('height'), 10)/20), right: (parseInt(d3.select('#pyramidChartBarChart').style('width'), 10)/20), bottom: (parseInt(d3.select('#pyramidChartBarChart').style('height'), 10)/20), left: (parseInt(d3.select('#pyramidChartBarChart').style('width'), 10)/5)},
            width = parseInt(d3.select('#pyramidChartBarChart').style('width'), 10) - margin.left - margin.right,
            height = parseInt(d3.select('#pyramidChartBarChart').style('height'), 10) - margin.top - margin.bottom;
    
    
          
    var y = d3.scaleBand()
    .range([height, 0]);
    var x = d3.scaleLinear().range([0, width]);

    var yAxis = d3.axisLeft(y)
    var xAxis = d3.axisBottom(x)
    .ticks(7)
    .tickFormat(d3.format(".2s"))
    .tickSize(-height);

    var svg = d3.select("#pyramidChartBarChart").select("svg").select("g");

    y.domain(dataset.map(function(d) { return d.label; }));
    x.domain([0, d3.max(dataset, function(d) { return d.value; })]);

    yAxis.tickFormat(function(d,i){
        if(d.indexOf('M')>-1){
            return d.replace('M','Male ');
        }else
        if(d.indexOf('F')>-1){
            return d.replace('F','Female ');
        }
    });
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    svg.select(".y.axis").remove();
    svg.select(".x.axis").remove();

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(0)")
            .attr("x", 45)
            .attr("dx", ".1em")
            .attr("y",75)
            .style("text-anchor", "end")
            .text("Number of cases");


    var bar = svg.selectAll("rect")
            .data(dataset, function(d) { return d.label; });
    // new data:
    bar.enter().append("rect")
            .attr("class", "pyramiddetailsbar")
            .attr("x", function(d) { return 1; })
            .attr("y", function(d) { return y(d.label); })
            .attr("width", function(d) { return x(d.value); })
            .attr("height", 4)
            .on("mouseover", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html(((d.label).indexOf('M')>-1?'Male':'Female')+"<br>"+(d.value));
            })
            .on("mouseout", function(d){
                div.style("display", "none");
            });


    // removed data:
    bar.exit().remove();

    // updated data:
    bar.transition()
            .duration(750)
            .attr("x", function(d) { return 1; })
            .attr("y", function(d) { return y(d.label); })
            .attr("width", function(d) { return x(d.value); })
            .attr("height", 4);

}