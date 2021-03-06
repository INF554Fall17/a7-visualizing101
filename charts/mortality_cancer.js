function renderMortalityWorldMap(){
 
  // only works if array.length-1 is between 3 and 9 (d3 color scheme)
  
  var init_year = 2000;
  // var headline = "Cancer Mortality & Survival Rate in ";
  var centered;

  /// main

  // slider
  d3.select("#worldMortalitySurvivalMap").insert("p", ":first-child").append("input")
      .attr("type", "range")
      .attr("min", "2000")
      .attr("max", "2015")
      .attr("value", init_year)
      .attr("id", "year")
      .attr("step", "5");

//  d3.select("#worldMortalitySurvivalMap").insert("h2", ":first-child").text(headline + init_year);

  // init map container, projection
  var width = 960, height = 425;
  var svg_map = d3.select("#worldMortalitySurvivalMap").insert("svg")
                .attr("id", "map")
                .attr("viewBox", "0 0 "+(width)+" "+(height));
                
  var path = d3.geoPath(d3.geoRobinson());

  // init legend container
  svg_map.append("g")
      .attr("class", "legend");
  svg_map.append("g")
      .attr("class", "legend_title")
      .append("text");

  // init bars container
  var margin = {top: 50, right:10, bottom:50, left:30};
  var svgBarsWidth = 960 - margin.left - margin.right,
      svgBarsHeight = 200 - margin.top - margin.bottom;

  var x = d3.scaleBand()
              .rangeRound([0, svgBarsWidth])
              .padding(.05);
  var y = d3.scaleLinear().range([svgBarsHeight, 0]);

  var svg_bars = d3.select("#worldMortalitySurvivalMap")
      .append("svg")
        .attr("id", "bars")
        .attr("viewBox", "0 0 "+(svgBarsWidth + margin.left + margin.right)+" "+(svgBarsHeight + margin.top + margin.bottom))        
      .append("g")
        .attr("class", "bars")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var dataset_survival; // global

  d3.json("charts/survival_cancer.json", function(data) {
      dataset_survival = data;
  });

  // load data
  d3.json("charts/mortality.json", function(error, d) {

    if (error) throw error;

    let data_all = d['mortality'];


    var dataAll =[];
    for(key in data_all){
      var dataYear = data_all[key];
        for(key in dataYear){
          var datum = dataYear[key];
          dataAll.push(datum);
        }
    }
    

   


    let data = data_all[init_year];
    let color = calcColorScale(dataAll);

    let data_all_survival = dataset_survival['survival'];

    let data_survival = data_all_survival[init_year];
    let color_survival = calcColorScaleGreen(data_survival);

   
    // load map data and render it
    d3.json("charts/world.json", function(error, worldmap) {
      if (error) throw error;

      // init map
      svg_map.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(worldmap, worldmap.objects.world).features)
        .enter().append("path")
          .attr("d", path)
          .on("click", clicked)
          .attr("id", function(d) { return d.id; })
          .call(fillMap, color, data)
        .append("title")
          .call(setPathTitle, data);

      // init legend
        renderLegend(color, data);
        renderBars(color_survival, data_survival);

    }); // map data

    // was the slider used?
    d3.select("#year").on("input", function() {
      //  let upd_color = calcColorScale(data_all[this.value]);
        let upd_color_survival = calcColorScaleGreen(data_all_survival[this.value]);
        updateMap(color, data_all[this.value]);
        renderLegend(color, data_all[this.value]);
        renderBars(upd_color_survival, data_all_survival[this.value]);
    });

  }); // disaster data
}
  function clicked(d) {
      
  }

function fillMap(selection, color, data) {
  var color_na = d3.rgb("#d4d4d4");
  // TODO: minor fix, sometimes d gets a -99, why?
  selection
    .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? color_na :
                                              d3.rgb(color(data[d.id])); });
}

function setPathTitle(selection, data) {
    selection
    .text(function(d) { return "" + d.id + ", " +
                               (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]); });
}

function updateMap(color, data) {

  // fill paths
  d3.selectAll("svg#map path").transition()
    .delay(100)
    .call(fillMap, color, data);

  // update path titles
  d3.selectAll("svg#map path title")
    .call(setPathTitle, data);

  // update headline
  // d3.select("h2").text(headline + d3.select("#year").node().value);
}

function renderLegend(color, data) {

  let svg_height = +d3.select("svg#map").attr("height");
  let legend_items = pairQuantiles(color.domain());

  let legend = d3.select("svg#map g.legend").selectAll("rect")
               .data(color.range());

  legend.exit().remove();

  legend.enter()
          .append("rect")
        .merge(legend)
          .attr("width", "20")
          .attr("height", "20")
          .attr("y", function(d, i) { return ((svg_height+245)-29) + 25*i; })
          .attr("x", 15)
          .attr("fill", function(d, i) { return d3.rgb(d); })
          .on("mouseover", function(d) { legendMouseOver(d, color, data); })
          .on("mouseout", function() { legendMouseOut(color, data); });

  let text = d3.select("svg#map g.legend").selectAll("text");

  text.data(legend_items)
    .enter().append("text").merge(text)
      .attr("y", function(d, i) { return ((svg_height+245)-14) + 25*i; })
      .attr("x", 45)
      .attr("z-index",5)
      .text(function(d, i) { return d; });

  d3.select("svg#map g.legend_title text")
        .text("Legend(%)")
        .attr("x", 15)
        .attr("y", 210);
}

function renderBars(color, data) {
  var margin = {top: 50, right:10, bottom:50, left:30};
  var svgBarsWidth = 960 - margin.left - margin.right,
  svgBarsHeight = 200 - margin.top - margin.bottom;

var x = d3.scaleBand()
          .rangeRound([0, svgBarsWidth])
          .padding(.05);
var y = d3.scaleLinear().range([svgBarsHeight, 0]);

  // turn data into array of objects
  array = [];
  for( let key of Object.keys(data) ) {
    array.push({'id':key, 'value': data[key]});
  }

  // sort by country id
  array = sortArrObj(array, 'id');

  x.domain(array.map(function(d) {return d.id;}));
  y.domain([0, d3.max(Object.values(data), function(d) {return d;})]);

  d3.select("svg#bars g.axis").remove();
  let axis = d3.select("svg#bars").append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate("+ 30 +"," + (svgBarsHeight+margin.top) + ")")
              .call(d3.axisBottom(x))
                .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("fill","#a9a9a9")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

  let bars = d3.select("svg#bars g.bars").selectAll("rect").data(array);
  bars.exit().remove();
  bars.enter().append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d.value); })
        .attr("stroke","#a9a9a9")
        .attr("stroke-width","2px")
        .attr("x", function(d) { return x(d.id); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) {return svgBarsHeight - y(d.value); });

  let annot = d3.select("svg#bars g.bars").selectAll("text").data(array);
  annot.exit().remove();
  annot.enter().append("text")
        .merge(annot)
        .text(function(d) {return d3.format(",")(d.value);})
        .attr("class", "barlabel")
        .attr("x", function(d) { return x(d.id) + x.bandwidth()/2; })
        .attr("y", function(d) { return y(d.value) - 5; });
}

function calcColorScale(data) {
  var quantiles = [0, 0.1,0.2,0.3,0.4, 0.5,0.6,0.7];
  // TODO: minor, check how many data poins we've got
  // with few datapoints the resulting legend gets confusing

  // get values and sort
  let data_values = Object.values(data).sort( function(a, b){ return a-b; });

  quantiles_calc = quantiles.map( function(elem) {
                  return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
              .domain(quantiles_calc)
              .range(d3.schemeReds[(quantiles_calc.length)-1]);

  return scale;
}

function calcColorScaleGreen(data) {

  // TODO: minor, check how many data poins we've got
  // with few datapoints the resulting legend gets confusing

  // get values and sort
  var quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1];
  let data_values = Object.values(data).sort( function(a, b){ return a-b; });

  quantiles_calc = quantiles.map( function(elem) {
                  return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
              .domain(quantiles_calc)
              .range(d3.schemeGreens[(quantiles_calc.length)-1]);

  return scale;
}

/// event handlers /////

function legendMouseOver(color_key, color, data) {
  var color_na = d3.rgb("#d4d4d4");
  // cancels ongoing transitions (e.g., for quick mouseovers)
  d3.selectAll("svg#map path").interrupt();

  // TODO: improve, only colored paths need to be filled

  // then we also need to refill the map
  d3.selectAll("svg#map path")
    .call(fillMap, color, data);

  // and fade all other regions
  d3.selectAll("svg#map path:not([fill = '"+ d3.rgb(color_key) +"'])")
      .attr("fill", color_na);
}

function legendMouseOut(color, data) {

  // TODO: minor, only 'colored' paths need to be refilled
  // refill entire map
  d3.selectAll("svg#map path").transition()
    .delay(100)
    .call(fillMap, color, data);
}

/// helper functions /////

// sorts an array of equally structured objects by a key
// only works if sortkey contains unique values
// TODO: minor, shorten
function sortArrObj(arr,sortkey) {

  sorted_keys = arr.map( function(elem) {return elem[sortkey];}).sort();

  newarr = [];
  for(let key of sorted_keys){
    for(i in arr){
      if(arr[i][sortkey] === key){
        newarr.push(arr[i]);
        continue;
      }
    }
  }

  return newarr;
}

// pairs neighboring elements in array of quantile bins
function pairQuantiles(arr) {

  new_arr = [];
  for (let i=0; i<arr.length-1; i++) {

    // allow for closed intervals (depends on d3.scaleQuantile)
    // assumes that neighboring elements are equal
    if(i == arr.length-2) {
      new_arr.push([arr[i],  arr[i+1]]);
    }
    else {
      new_arr.push([arr[i], arr[i+1]-1]);
    }
  }

  new_arr = new_arr.map(function(elem) { return elem[0] === elem[1] ?
    d3.format(",")(elem[0]) :
    d3.format(",")(elem[0]) + " - " + d3.format(",")(elem[1]);
  });

  return new_arr;
}