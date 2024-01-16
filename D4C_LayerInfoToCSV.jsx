var blendingModes = {
  "Luminescent Premul": 5245,
  "Alpha Add": 5244,
  "Silhouette Luma": 5243,
  "Silhouette Alpha": 5242,
  "Stencil Luma": 5241,
  "Stencil Alpha": 5240,
  "Luminosity": 5239,
  "Color": 5238,
  "Saturation": 5237,
  "Hue": 5236,
  "Divide": 5249,
  "Subtract": 5248,
  "Exclusion": 5235,
  "Classic Difference": 5234,
  "Difference": 5233,
  "Hard Mix": 5232,
  "Pin Light": 5231,
  "Vivid Light": 5230,
  "Linear Light": 5229,
  "Hard Light": 5228,
  "Soft Light": 5227,
  "Overlay": 5226,
  "Lighter Color": 5246,
  "Linear Dodge": 5223,
  "Classic Color Dodge": 5225,
  "Color Dodge": 5224,
  "Screen": 5222,
  "Lighten": 5221,
  "Add": 5220,
  "Darker Color": 5247,
  "Linear Burn": 5217,
  "Classic Color Burn": 5219,
  "Color Burn": 5218,
  "Multiply": 5216,
  "Darken": 5215,
  "Dancing Dissolve": 5214,
  "Dissolve": 5213,
  "Normal": 5212
};

// Function to export layer information to CSV
function exportLayerInfoToCSV(comp) {
  var saveFile = File.saveDialog("Save Layer Times CSV", "*.csv");
  
  if (saveFile) {
    saveFile.open("w");
    
    // Write the CSV header
    saveFile.writeln("Layer Name,Blending Mode,In-Point (seconds:frames),In-Point (seconds),In-Point (frames)");
    
    // Loop through the layers and write their information to the CSV
    var selectedLayers = comp.selectedLayers;
    var exportCount = 0;
    for (var i = 0; i <= selectedLayers.length; i++) {
      var layer = selectedLayers[i];
      // Exclude Shy and Guide Layers
      if (layer && !layer.shy && !layer.guideLayer) {
        var layerName = layer.name;
        var inPoint = layer.inPoint;
        var blendingMode = layer.blendingMode;
        
        // Convert inPoint to seconds and round to the hundredth decimal place
        var inPointSeconds = (inPoint).toFixed(2);
        var inPointSecondsTruncate = (inPoint.toFixed(0));
        var inPointFrames = inPoint * comp.frameRate;
        if (inPointFrames < comp.FrameRate) {
          var inPointFramesTruncate = inPointFrames;
        } else {
          var inPointFramesTruncate = Math.floor(inPointFrames % comp.frameRate);
        }
        
        // Get the source name (footage or precomp name)
        var sourceName = "";
        if (layer.source instanceof FootageItem) {
          sourceName = layer.source.name;
        } else if (layer.source instanceof CompItem) {
          sourceName = "Precomp: " + layer.source.name;
        }
        
        // Write layer info to CSV
        saveFile.writeln(layerName + "," + getBlendingModeName(blendingMode) + "," + inPointSecondsTruncate +":"+inPointFramesTruncate + "," + inPointSeconds +","+inPointFrames);
        exportCount++;
      }
    }
    
    saveFile.close();
    alert(exportCount + " layer timings exported to " + saveFile.fsName);
  } else { alert('Could not write CSV. Check scripts have Read/Write permission.');}
}

// Function to get blending mode name from blending mode integer
function getBlendingModeName(mode) {
  for (var name in blendingModes) {
    if (blendingModes[name] === mode) { return name; }
  }
  return "Unknown"; // Return "Unknown" if the mode is not found - this really should not happen, and if it does, you are far from the light of God.
}

// Primary function
var activeComp = app.project.activeItem;
if (activeComp && activeComp instanceof CompItem && activeComp.selectedLayers.length > 0) {
  exportLayerInfoToCSV(activeComp);
} else if (activeComp.selectedLayers.length == 0) {
  alert('Please select layers to export timing.');
} else {
  alert("Please select or open a composition first.");
}