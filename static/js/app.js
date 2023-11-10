const url= "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


// Function to initialize the dashboard
function init() {
    // Fetch data from the provided URL
    d3.json(url).then(function(data) {
      // Get the names (IDs) for the dropdown menu
      var names = data.names;
  
      // Populate the dropdown menu with options
      var dropdownMenu = d3.select("#selDataset");
      names.forEach(function(name) {
        dropdownMenu.append("option").text(name).property("value", name);
      });
  
      // Call the function to update the charts based on the default selected name
      optionChanged(names[0]);
    });
  }
  
  // Function to update the charts based on the selected name
  function optionChanged(selectedName) {
    // Fetch data again to get the selected individual's information
    d3.json(url).then(function(data) {
      // Filter the data for the selected individual
      var selectedData = data.samples.find(sample => sample.id === selectedName);
  
      // Get the top 10 OTUs data
      var top10Values = selectedData.sample_values.slice(0, 10).reverse();
      var top10Labels = selectedData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
      var top10HoverText = selectedData.otu_labels.slice(0, 10).reverse();
  
      // Create the horizontal bar chart
      var trace = {
        type: "bar",
        x: top10Values,
        y: top10Labels,
        orientation: "h",
        text: top10HoverText
      };
  
      var layout = {
        title: `Top 10 OTUs for ${selectedName}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };
  
      Plotly.newPlot("bar", [trace], layout);

      // Display sample metadata
      displaySampleMetadata(selectedName);
    });
  }
  // Function to display sample metadata
function displaySampleMetadata(selectedName) {
    // Fetch data again to get the selected individual's information
    d3.json(url).then(function(data) {
        // Filter the data for the selected individual
        var selectedMetadata = data.metadata.find(metadata => metadata.id == selectedName);

        // Select the div to display metadata
        var metadataDiv = d3.select("#sample-metadata");

        // Clear existing metadata
        metadataDiv.html("");

        // Iterate through key-value pairs and append them to the div
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    });
}

  init();
  // Function to update the bubble chart based on the selected name
function updateBubbleChart(selectedName) {
    // Fetch data again to get the selected individual's information
    d3.json(url).then(function(data) {
      // Filter the data for the selected individual
      var selectedData = data.samples.find(sample => sample.id === selectedName);
  
      // Create the bubble chart
      var trace = {
        type: "scatter",
        mode: "markers",
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        marker: {
          size: selectedData.sample_values,
          color: selectedData.otu_ids,
          colorscale: "Viridis"
        },
        text: selectedData.otu_labels
      };
  
      var layout = {
        title: `Bubble Chart for ${selectedName}`,
        xaxis: { title: "OTU IDS" },
        yaxis: { title: "Sample Values" }
      };
  
      Plotly.newPlot("bubble", [trace], layout);
    });
  }
  
//Assuming you have a dropdown menu with the id 'selDataset'
//Attach an event listener to the dropdown menu to update the charts
  d3.select("#selDataset").on("change", function() {
    var selectedName = d3.select("#selDataset").property("value");
    updateBubbleChart(selectedName);
  });
  
//Call the updateBubbleChart function with the default selected name
  updateBubbleChart("initialDefaultName");
  
  // Call the init function to initialize the dashboard
  init();
  
  