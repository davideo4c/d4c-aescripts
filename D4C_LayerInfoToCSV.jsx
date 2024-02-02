var exportOptions = [];

// PRIMARY USER INTERFACE
function createUI() {
    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
        dialog.text = "Export Layer Timings"; 
        dialog.orientation = "row"; 
        dialog.alignChildren = ["center","center"]; 
        dialog.spacing = 10; 
        dialog.margins = 16; 

    // CHECKBOXES
    // ==========
    var checkboxes = dialog.add("group", undefined, {name: "checkboxes"}); 
        checkboxes.orientation = "column"; 
        checkboxes.alignChildren = ["center","center"]; 
        checkboxes.spacing = 0; 
        checkboxes.margins = 0; 

    var statictext1 = checkboxes.add("statictext", undefined, undefined, {name: "statictext1"}); 
        statictext1.text = "Include:"; 

    var btnBlendMode = checkboxes.add("checkbox", undefined, undefined, {name: "btnBlendMode"}); 
        btnBlendMode.text = "Blend Mode"; 

    var btnInPntSF = checkboxes.add("checkbox", undefined, undefined, {name: "btnInPntSF"}); 
        btnInPntSF.text = "In-Point (s:f)"; 

    var btnInPntS = checkboxes.add("checkbox", undefined, undefined, {name: "btnInPntS"}); 
        btnInPntS.text = "In-Point (s)"; 

    var btnInPntF = checkboxes.add("checkbox", undefined, undefined, {name: "btnInPntF"}); 
        btnInPntF.text = "In-Point (f)";
        
    var btnComment = checkboxes.add("checkbox", undefined, undefined, {name: "btnComment"}); 
        btnComment.text = "Comments";

    var btnTrackMattes = checkboxes.add("checkbox", undefined, undefined, {name: "btnTrackMattes"}); 
        btnTrackMattes.text = "Track Mattes";
        
    var btnFadeInTime = checkboxes.add("checkbox", undefined, undefined, {name: "btnFadeInTime"});
        btnFadeInTime.text = "Fade In Length";

    var btnFadeOutTime = checkboxes.add("checkbox", undefined, undefined, {name: "btnFadeOutTime"});
      btnFadeOutTime.text = "Fade Out Length";

    // FUNCTION BUTTONS
    // ============
    var functionBtns = dialog.add("group", undefined, {name: "functionBtns"}); 
        functionBtns.orientation = "column"; 
        functionBtns.alignChildren = ["center","center"]; 
        functionBtns.spacing = 10; 
        functionBtns.margins = 0; 

    var btnExport = functionBtns.add("button", undefined, undefined, {name: "btnExport"}); 
        btnExport.text = "Export CSV"; 

    var btnCancel = functionBtns.add("button", undefined, undefined, {name: "btnCancel"}); 
        btnCancel.text = "Cancel"; 

    // Button Functionality
    btnExport.onClick = function() {
      exportOptions = [
        { 
            info: 'Blend Mode', 
            shouldExport: btnBlendMode.value, 
            generateInfo: function(layer) {
                return "," + getBlendingModeName(layer.blendingMode);
            } 
        },
        { 
            info: 'In-Point (sec:frame)', 
            shouldExport: btnInPntSF.value, 
            generateInfo: function(layer) {
                var inPointSecondsTruncate = (Math.floor(layer.inPoint));
                var inPointFrames = layer.inPoint * layer.containingComp.frameRate;
                if (inPointFrames >= layer.containingComp.frameRate) {
                    var inPointFrames = Math.floor(inPointFrames % layer.containingComp.frameRate);
                }
                return "," + inPointSecondsTruncate +":"+inPointFrames;
            } 
        },
        { 
            info: 'In-Point (sec)', 
            shouldExport: btnInPntS.value,
            generateInfo: function(layer) {
            var inPointSeconds = (layer.inPoint).toFixed(2);
            return "," + inPointSeconds;
            } 
        },
        { 
            info: 'In-Point (frame)',
            shouldExport: btnInPntF.value,
            generateInfo: function(layer) {
                var inPointFrames = layer.inPoint * layer.containingComp.frameRate;
                return ","+ inPointFrames;
            }
        },
        { 
            info: 'Comment',
            shouldExport: btnComment.value,
            generateInfo: function(layer) {
            var comment = layer.comment;
            return "," + comment;
            }
        },
        { 
            info: 'Track Matte,Matte Type,Is Track Matte?',
            shouldExport: btnTrackMattes.value,
            generateInfo: function(layer) {
                var trackMatteInfo = "";
                var trackMatteTypeInfo = "";
                var isTrackMatte = "";
                if (layer.hasTrackMatte) {
                trackMatteInfo = '"' + layer.trackMatteLayer.name + '"';
                trackMatteTypeInfo = getTrackMatteType(layer.trackMatteType);
                }
                if (layer.isTrackMatte) {
                isTrackMatte = "X";
                }
                return "," + trackMatteInfo + "," + trackMatteTypeInfo + "," + isTrackMatte;
            }
        },
        {   info: 'Fade In Time (sec:frame),Fade In Time (frames)',
            shouldExport: btnFadeInTime.value,
            generateInfo: function(layer) {
                var fadeInTime = "";
                if (layer.opacity.numKeys >= 2 && layer.opacity.keyValue(1) < layer.opacity.keyValue(2)) {
                    var fadeInTime = layer.opacity.keyTime(2);
                    //alert("Fade in time is " + fadeInTime);
                    fadeInTime += -layer.inPoint;
                    var fadeInTimeSecondsTruncate = (Math.floor(fadeInTime));
                    var fadeInTimeFrames = fadeInTime * layer.containingComp.frameRate;
                    if (fadeInTimeFrames >= layer.containingComp.frameRate) {
                        var fadeInTimeFramesTruncate = Math.round(fadeInTimeFrames % layer.containingComp.frameRate);
                    } else { var fadeInTimeFramesTruncate = Math.round(fadeInTimeFrames); }
                    return "," + fadeInTimeSecondsTruncate + ":" + fadeInTimeFramesTruncate + "," + Math.round(fadeInTimeFrames);
                } else {
                    return ",,";
                }
            }
        },
        {   info: 'Fade Out Start Time (sec:frame), Fade Out Length (sec:frame),Fade Out Length (frames)',
            shouldExport: btnFadeOutTime.value,
            generateInfo: function(layer) {
                var fadeOutTime = "";
                // CHECK THAT THERE IS A FADE OUT ON OPACITY
                if (layer.opacity.numKeys >= 2 && layer.opacity.keyValue(layer.opacity.numKeys) < layer.opacity.keyValue(layer.opacity.numKeys - 1)) {
                    var fadeOutTime = layer.opacity.keyTime(layer.opacity.numKeys) - layer.opacity.keyTime(layer.opacity.numKeys - 1);
                    var fadeOutStartTime = layer.opacity.keyTime(layer.opacity.numKeys - 1) - layer.inPoint;
                    // FADE OUT LENGTH TIME FORMATTING
                    var fadeOutTimeSecondsTruncate = (Math.floor(fadeOutTime));
                    var fadeOutTimeFrames = fadeOutTime * layer.containingComp.frameRate;
                    if (fadeOutTimeFrames >= layer.containingComp.frameRate) {
                        var fadeOutTimeFramesTruncate = Math.round(fadeOutTimeFrames % layer.containingComp.frameRate);
                    } else { var fadeOutTimeFramesTruncate = Math.round(fadeOutTimeFrames); }
                    // FADE OUT START TIME FORMATTING
                    var fadeOutStartSecondsTruncate = (Math.floor(fadeOutStartTime));
                    var fadeOutStartFrames = fadeOutStartTime * layer.containingComp.frameRate;
                    if (fadeOutStartFrames >= layer.containingComp.frameRate) {
                        var fadeOutStartFramesTruncate = Math.round(fadeOutStartFrames % layer.containingComp.frameRate);
                    } else { var fadeOutStartFramesTruncate = Math.round(fadeOutStartFrames); }
                    return "," + fadeOutStartSecondsTruncate + ":" + fadeOutStartFramesTruncate + "," + fadeOutTimeSecondsTruncate + ":" + fadeOutTimeFramesTruncate + "," + Math.round(fadeOutTimeFrames);
                } else {
                    return ",,,";
                }
            }
    }
      ];
      main();
    }
    btnCancel.onClick = function() {
        dialog.close();
    }
    dialog.show();
}

function makeLayerInfo(layer) {
    var layerInfo = "";
    for (var i = 0; i < exportOptions.length; i++) {
        if (exportOptions[i].shouldExport) {
            layerInfo += exportOptions[i].generateInfo(layer);
        }
    }
    return layerInfo
}

// Function to export layer information to CSV
function exportLayerInfoToCSV(comp) {
  var saveFile = File.saveDialog("Save Layer Times CSV", "*.csv");
  
  if (saveFile) {
    saveFile.open("w");
    headerLine = "Layer Name"
    for (i = 0; i < exportOptions.length; i++) {
      if (exportOptions[i].shouldExport) {
        headerLine += "," + exportOptions[i].info;
      }
    }
    saveFile.writeln(headerLine);
    // Loop through the layers and write their information to the CSV
    var selectedLayers = comp.selectedLayers;
    var exportCount = 0;
    for (var i = 0; i < selectedLayers.length; i++) {
      var layer = selectedLayers[i];
      var layerName = '"' + layer.name + '"';
      // Exclude Shy and Guides
      if (layer && !layer.shy && !layer.guideLayer) {
        // alert("Found layer " + layerName +", exporting.")     
        saveFile.writeln(layerName + makeLayerInfo(layer))
        exportCount++;
      }
    }
    saveFile.close();
    // dialog.close();
    alert(exportCount + " layer timings exported to " + saveFile.fsName);
  } else { alert('Could not write CSV. Check that under Settings > Scripting & Expressions, Allow Scripts to Read and Write Files is checked.');}
}

// Function to get blending mode name from blending mode integer
function getBlendingModeName(mode) {
  for (var name in blendingModes) {
    if (blendingModes[name] === mode) { return name; }
  }
  return "Unknown"; // Return "Unknown" if the mode is not found - this really should not happen, and if it does, you are far from the light of God.
}

// Function to get the Track Matte's type
function getTrackMatteType(type) {
  for (var name in trackMattes) {
    if (trackMattes[name] === type) { return name; }
  }
  return "Unknown"; // Return "Unknown" if the mode is not found - this really should not happen, and if it does, you are far from the light of God.
}

function main() {
    // Primary function
    var activeComp = app.project.activeItem;
    if (activeComp && activeComp instanceof CompItem && activeComp.selectedLayers.length > 0) {
    exportLayerInfoToCSV(activeComp);
    dialog.close();
    } else if (activeComp.selectedLayers.length == 0) {
    alert('Please select layers to export timing.');
    } else {
    alert("Please select or open a composition first.");
    }
}

createUI();

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

var trackMattes = {
  "ALPHA": TrackMatteType.ALPHA,
  "ALPHA INVERT": TrackMatteType.ALPHA_INVERTED,
  "LUMA": TrackMatteType.LUMA,
  "LUMA INVERT": TrackMatteType.LUMA_INVERTED
};