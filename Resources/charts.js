function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
// Create the buildChart function.
function buildCharts(sample) {
    // Use d3.json to load the samples.json file 
    d3.json("samples.json").then((data) => {
      console.log(data);
  
      // Create a variable that holds the samples array. 
      var samples = data.samples;
      console.log(samples);
      // Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata;
      var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
      // Create a variable that holds the first sample in the array.
      var result = resultArray[0];
  
      // 2. Create a variable that holds the first sample in the metadata array.
        var gaugeResult=gaugeArray[0]
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;
  
      // 3. Create a variable that holds the washing frequency.
      var wfreqs = gaugeResult.wfreq;
      console.log(wfreqs)
  
      // Create the yticks for the bar chart.
      var yticks = ids.slice(0,10).map(sampleObj => "OTU" + sampleObj).reverse();
      console.log(yticks);
      var barData = [{
        x: values.slice(0,10).reverse(),
        y: yticks,
        type: "bar",
        orientation: "h",
        text: labels.slice(0,10).reverse()
      }];
      // Use Plotly to plot the bar data and layout.
      var barLayout = {
        title: "Top Ten Bacteria Cultures Found"};
      Plotly.newPlot("bar", barData, barLayout);

      
      var bubbleData = [{
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
          marker: {
            size: values,
            color: ids,
            colourscale: "Portland"
          }
      }];
      // Use Plotly to plot the bubble data and layout.
      var bubbleLayout = {
        title: "Bacteria Cultures per Sample",
        xaxis: {title: 'OTU ID'},
        automargin: true,
        hovermode: "closest"
      };
      Plotly.newPlot("bubble",bubbleData, bubbleLayout); 
      
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        value: wfreqs,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
        gauge: {
          axis: {range: [null,10], dtick: "2"},
  
          bar: {color: "black"},
          steps:[
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
          ],
          dtick: 2
        }
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        automargin: true
       
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  }
  