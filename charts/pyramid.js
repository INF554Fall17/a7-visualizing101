	
	var margin = {top: 0, bottom: 0, left: 0, right: 0},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom,
    svg = d3.select("#viz").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")"),
    t = d3.transition()
        .duration(750),
    x_scale_male = d3.scaleLinear()
        .range([0, width /2]),
    x_scale_female = d3.scaleLinear()
        .range([0, width / 2]),
    y_scale = d3.scaleBand()
        .rangeRound([0, height])
        .padding(.3);

d3.queue()
    .defer(d3.csv, "pyramidData.csv")
    .await(ready);

function ready(error, data){

    // types
    var number_columns = ["year","index","typeOfCancer","total_males","total_females","M0-14","M15-59","M60+","F0-14","F15-59","F60+"];

    data.forEach(function(d){

        number_columns.forEach(function(col){
            if(col!="typeOfCancer")
                d[col] = +d[col];

        });

        return d;

    });

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
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("width", function(d){ return x_scale_male(d["M0-14"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "blue");
                
        male_bar.enter().
            append("rect")
                .attr("class", "bar male")
                .attr("x",function(d){ return (width / 2)+80+x_scale_male(d["M0-14"])})
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("width", function(d){ return x_scale_male(d["M15-59"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "black");

        male_bar.enter().
                append("rect")
                    .attr("class", "bar male")
                    .attr("x",function(d){ return (width / 2)+80+x_scale_male(d["M0-14"])+ x_scale_male(d["M15-59"])})
                    .attr("y", function(d){ return y_scale(d.index); })
                    .attr("width", function(d){ return x_scale_male(d["M60+"]); })
                    .attr("height", y_scale.bandwidth())
                    .attr("fill", "blue");

        label_bar.enter().append("text")
                 .attr("x",width/2)
                 .attr("y",function(d){ return y_scale(d.index)+15; })
                 .attr("text-anchor","middle")
                 .text(function(d){return d.typeOfCancer;})

        female_bar.enter().append("rect")
                .attr("class", "bar female")
                .attr("x", function(d){ return (width / 2 - x_scale_female(d["F0-14"])-80); })
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("width", function(d){ return x_scale_female(d["F0-14"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "red");
        
        female_bar.enter().append("rect")
                .attr("class", "bar female")
                .attr("x", function(d){ return (width / 2 - x_scale_female(d["F0-14"])-80 - x_scale_female(d["F15-59"])); })
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("width", function(d){ return x_scale_female(d["F15-59"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "black");

        female_bar.enter().append("rect")
                .attr("class", "bar female")
                .attr("x", function(d){ return (width / 2 - x_scale_female(d["F0-14"])-80 - x_scale_female(d["F15-59"]) - x_scale_female(d["F60+"])); })
                .attr("y", function(d){ return y_scale(d.index); })
                .attr("width", function(d){ return x_scale_female(d["F60+"]); })
                .attr("height", y_scale.bandwidth())
                .attr("fill", "red");


    }

}