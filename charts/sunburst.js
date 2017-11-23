function renderSunBurst(){
var width = 450;
var height = 600;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 175, h: 30, s: 3, t: 10
};
var color = d3.scaleOrdinal(d3["schemeCategory20c"]);


// Mapping of step names to colors.
var colors = {
 "B":"#778899",
  "E":"#778899",
  "Measles":"#778899",
  "Tetanus":"#778899",
  "Whooping cough":"#778899",
  "STD":"#778899",
  "Encephalitis": "#778899",  
  "Hepatitis":"#778899",
  "Meningitis": "#778899",
  "Childhood Diseases":"#778899",
  "Communicable": "#DCDCDC",
  "Unintentional": "#D2691E",
  "Intentional": "#7b615c",
  "Syphilis": "#778899",
  "HIV": "#566573  ",
  "Noncommunicable":"#5687d1",
  "Cancer":{color:"#9370DB", desc:"Cancer is a group of diseases involving abnormal cell growth with the potential to invade or spread to other parts of the body. These contrast with benign tumors, which do not spread to other parts of the body. Cancerous tumors are malignant, which means they can spread into, or invade, nearby tissues. In addition, as these tumors grow, some cancer cells can break off and travel to distant places in the body through the blood or the lymph system and form new tumors far from the original tumor."},
  "Cardiovascular diseases":"#2ECC71  ",
  "Injuries":"#A0522D",
  "Ischaemic heart disease": "#16A085",
  "Stroke": "#117864",
  "Haemorrhagic":"#A2D9CE",
  "Ischaemic":"#A9DFBF",
  "Road": "#FFE4C4",
  "Other": "#E6E6FA",
  "Falls":"#FFF8DC",
  "Drowning": "#F4A460",
  "Self harm":"#FFEBCD",
  "Interpersonal violence":"#D2B48C",
  "Fire":"#DEB887",
  "Collective violence": "#DEB887",
  "Mechanical forces":"#DEB887",
  "Poisonings":"#DEB887",
  "Infectious":"#A9A9A9",
  "Neonatal conditions":"#808080",
  "Nutritional deficiencies":"#696969",
  "Maternal conditions":"#696969",
  "Preterm birth":"#5F6A6A  ",
  "asphyxia":"#B0C4DE",
  "Diarrhoeal":"#99A3A4",
  "Tuberculosis":"#85929E",
  "Parasitic":"#5F6A6A  ",
  "Malaria":"#2F4F4F",
  "Neonatal sepsis and infections":"#566573",
  "Protein malnutrition":"#1B2631",
  "iron deficiency":"#1B2631",
  "Respiratory diseases":"#FF4500",
  "Digestive diseases":"#FF7F50",
  "Neurological conditions":"#E9967A",
  "Diabetes":"#FF6347",
  "Genitourinary diseases":"#B03A2E",
  "Congenital anomalies":"#B22222",
  "Endocrine":"#B22222",
  "Mental & substance disorder":"#B22222",
  "Neoplasms":"#B22222",
  "Skin diseases":"#B22222",
  "Musculoskeletal diseases":"#B22222",
  "Rheumatoid arthritis":"#B22222",
  "Alcohol disorder":"#800000",
  "Drug disorder":"#800000",
  "Other Haemoglobin":"#800000",
  "Sickle cell disorders and trait":"#800000",
  "Opioid":"#800000",
  "Kidney":"#800000",
  "Other urinary diseases":"#800000",
  "Congenital heart anomalies":"#800000",
  "Other congenital anomalies":"#800000",
  "Neural tube defects":"#800000",
  "Chronic":"#CB4335",
  "Alzheimer":"#EB984E",
  "Epilepsy":"#EB984E",
  "Parkinson":"#EB984E",
  "Paralytic ileus":"#FA8072",
  "Peptic ulcer":"#FA8072",
  "Cirrhosis":"#FA8072",
  "Appendicitis":"#FA8072",
  "Gastritis":"#FA8072",
  "Pancreatitis":"#FA8072",
  "Gallbladder and biliary diseases":"#FA8072",
"due to alcohol use":"#CD5C5C",
"due to hepatitis B":"#CD5C5C",
"due to hepatitis C":"#CD5C5C",
"Asthma":"  #E74C3C ",
"Hypertensive":"#6B8E23",
"Cardiomyopathy":"#808000",
"Rheumatic":"#148F77",
"Liver":"4B0082",
"Colon and rectum":"#5B2C6F",
"Stomach cancer":"#C39BD3",
"Breast":"FF69B4",
"Oesophagus cancer":"#DB7093",
"Pancreas":"#C39BD3",
"Prostate":"#D7BDE2",
"Lymphomas":"#BB8FCE",
"Corpus uteri":"  #800080",
"Larynx":"  #800080",
"Melanoma and Non":"  #800080",
"m1elanoma":"#800080",
"Non melanoma skin cancer":"#800080",
"Malignant skin melanoma":"#800080",
"Ovary":"#9932CC",
"Gallbladder":"#9932CC",
"Bladder":"#9932CC",
"Brain and nervous system":"#9B59B6",
"Cervix uteri":"#633974",
"Mouth & oropharynx":"#633974",
"Leukaemia":"#884EA0",
"Nasopharynx":"#D2B4DE",
"Lip and oral cavity":"#D2B4DE",
"Multiple myeloma":"#D2B4DE",
"Non Hodgkin lymphoma":"#D2B4DE",
"secondary to alcohol use":"#633974",
"secondary to hepatitis B":"#633974",
"secondary to hepatitis C":"#633974"

};

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#chart").append("svg:svg")
    .attr("viewBox","0 0 "+width+" "+height)
  //  .attr("width", width)
  //  .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.partition()
    .size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

// Use d3.text and d3.csvParseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("data/ranking.csv", function(text) {
  var csv = d3.csvParseRows(text);
  var json = buildHierarchy(csv);
  createVisualization(json);
 });

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  initializeBreadcrumbTrail();
  drawLegend();
  d3.select("#togglelegend").on("click", toggleLegend);

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);


  vis.append("text")
  .attr("id","percentage")
 .attr("text-anchor","left")
  .attr("dx",-40  )
  .attr("dy","-1em")
  .attr("fill","#FFF")
  .style("font-size", "1.5em")

  vis.append("text")
  .attr("dy","0.5em")
  .attr("dx",-70)
  .attr("fill","#FFF")
  .text("of Deaths WorldWide")
  .style("font-size", ".8em");
  


  // Turn the data into a d3 hierarchy and calculate the sums.
  var root = d3.hierarchy(json)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });
  
  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition(root).descendants()
      .filter(function(d) {
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { if (typeof colors[d.data.name] == 'string' || typeof colors[d.data.name]=='undefined')
                                      {return colors[d.data.name]}
                                    else
                                  {return colors[d.data.name].color;} 
       })
      .style("opacity", 1)
      .on("mouseover", mouseover);

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.datum().value;
  mouseover(nodes[5]);
  defaultsunburst = nodes[5];
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  var percentage =  (100*d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  var name = d["data"]["name"];
  if(d.parent.data.name == "Cancer"){
    if(name.indexOf("cancer") == -1)
      {name+=" Cancer";}
  }
  var desc = colors[d["data"]["name"]].desc;
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  d3.select("#percentage")
      .text(percentageString);

 // d3.select("#explanation")
 //     .style("visibility", "");

  var sequenceArray = d.ancestors().reverse();
  sequenceArray.shift(); // remove root node from the array
  updateBreadcrumbs(sequenceArray, percentageString);
d3.select("#facts")
.text(name+" Deaths WorldWide:  "+percentageString);
d3.select("#factsDesc")
.text(desc)
.style("font-color","white");
  // Fade all the segments.
  d3.select('#chart').selectAll("path")
      .style("opacity", 0.3)

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1)
      .attr("stroke-width","3px");
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(100)
      .style("opacity", 1)
      .attr("stroke-width","1px")
      .on("end", function() {
              d3.select(this).on("mouseover", mouseover);
               mouseover(defaultsunburst);
            });

  d3.select("#explanation")
      .style("visibility", "hidden");

 
 
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
        .attr("viewBox","0 0 800 50")
     // .attr("width", 800)
     // .attr("height", 50)
     //.attr("z-index","9")
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000")
    .attr("textLength",b.w)
    .attr("lengthAdjust","spacingAndGlyphs");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var trail = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.data.name + d.depth; });

  // Remove exiting nodes.
  trail.exit().remove();

  // Add breadcrumb and label for entering nodes.
  var entering = trail.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d)  { if (typeof colors[d.data.name] == 'string' || typeof colors[d.data.name]=='undefined')
                                      {return colors[d.data.name]}
                                    else
                                  {return colors[d.data.name].color;} });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.data.name; });

  // Merge enter and update selections; set position for all nodes.
  entering.merge(trail).attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Now move and update the percentage at the end.
  /*d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);*/

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colors))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};
}