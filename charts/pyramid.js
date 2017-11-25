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
        .rangeRound([100, height])
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
    .attr("xlink:href","../images/female.png").attr("height", "100px").attr("width", "100px")
    .attr("x", (width / 2)-150  )
    .attr("y", 0)
    ;

svg.append("image")
    .attr("xlink:href","../images/male.png").attr("height", "100px").attr("width", "100px")
    .attr("x", (width / 2)+50  )
    .attr("y", 0)
    ;

d3.queue()
    .defer(d3.csv, "charts/pyramidData.csv")
    .await(ready);
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
        .range([0, (width /2)]),
    x_scale_female = d3.scaleLinear()
        .range([0, (width /2)]),
    y_scale = d3.scaleBand()
        .rangeRound([100, height])
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
                .attr("x", (width / 2)+80)  
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("width", function(d){ return x_scale_male(d["M0-14"]); })  
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(158,202,225)");
                
        male_bar.enter().
            append("rect")
                .attr("class", "bar male")
                .attr("x",function(d){ return (width / 2)+80+x_scale_male(d["M0-14"])})
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); }) 
                .attr("width", function(d){ return x_scale_male(d["M15-29"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(107,174,214)");

        male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+80+x_scale_male(d["M0-14"])+ x_scale_male(d["M15-29"])})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M30-49"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(66,146,198)");

              male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+80+x_scale_male(d["M0-14"])+x_scale_male(d["M15-29"])+ x_scale_male(d["M30-49"])})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M50-59"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(33,113,181)");
              male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+80+x_scale_male(d["M0-14"])+x_scale_male(d["M15-29"])+x_scale_male(d["M30-49"])+ x_scale_male(d["M50-59"])})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M60-69"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(8,81,156)");
                  
                 male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+80+x_scale_male(d["M0-14"])+x_scale_male(d["M15-29"])+x_scale_male(d["M30-49"])+ x_scale_male(d["M50-59"])+x_scale_male(d["M60-69"])})
                    .attr("y", function(d){ return y_scale(20); })
                    .transition(t)
                    .attr("y", function(d){ return y_scale(d.index); }) 
                    .attr("width", function(d){ return x_scale_male(d["M70+"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "rgb(8,48,107)");
                  

        label_bar.enter().append("text")
                 .attr("x",width/2)
                 .attr("y",function(d){ return y_scale(d.index)+15; })
                 .attr("text-anchor","middle")
                 .text(function(d){return d.typeOfCancer;})

        female_bar.enter().append("rect")
                .attr("class", "bar female")
               // .attr("x", function(d){ return (width / 2)-80; })
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); }) 
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-80; })                
                .attr("width", function(d){ return x_scale_female(d["F0-14"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(158,202,225)");
        
        female_bar.enter().append("rect")
                .attr("class", "bar female")
                //.attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-80 - x_scale_female(d["F15-29"]); })
                .attr("width", function(d){ return x_scale_female(d["F15-29"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(107,174,214)");

        female_bar.enter().append("rect")
                .attr("class", "bar female")
               // .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-80 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]); })
                .attr("width", function(d){ return x_scale_female(d["F30-49"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(66,146,198)");

        female_bar.enter().append("rect")
                .attr("class", "bar female")
               // .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"])- x_scale_female(d["F30-49"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-80 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]) - x_scale_female(d["F50-59"]); })
                .attr("width", function(d){ return x_scale_female(d["F50-59"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(33,113,181)");

         female_bar.enter().append("rect")
                .attr("class", "bar female")
              //  .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"])- x_scale_female(d["F30-49"])- x_scale_female(d["F50-59"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-80 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]) - x_scale_female(d["F50-59"])- x_scale_female(d["F60-69"]); })
                .attr("width", function(d){ return x_scale_female(d["F60-69"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(8,81,156)");

        female_bar.enter().append("rect")
                .attr("class", "bar female")
              //  .attr("x", function(d){ return (width / 2)-80- x_scale_female(d["F0-14"])- x_scale_female(d["F15-29"])- x_scale_female(d["F30-49"])- x_scale_female(d["F50-59"])- x_scale_female(d["F60-69"]); }) 
                .attr("y", function(d){ return y_scale(20); })
                .transition(t)
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("x", function(d){ return (width / 2) - x_scale_female(d["F0-14"])-80 - x_scale_female(d["F15-29"]) - x_scale_female(d["F30-49"]) - x_scale_female(d["F50-59"])- x_scale_female(d["F60-69"])- x_scale_female(d["F70+"]); })
                .attr("width", function(d){ return x_scale_female(d["F70+"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "rgb(8,48,107)");


    }

}
