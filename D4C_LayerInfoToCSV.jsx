var exportOptions = [];
var layerTimingsRelative = false;
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
  var dialog;

// PRIMARY USER INTERFACE
function createUI() {
    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
        dialog.text = "Export Layer Timings"; 
        dialog.orientation = "column"; 
        dialog.alignChildren = ["center","center"]; 
        dialog.spacing = 10; 
        dialog.margins = 16;

    var layerTimings = dialog.add("group", undefined, {name:"layerTimings"});
        layerTimings.orientation = "column";
        layerTimings.alignChildren = ["center","center"];
        layerTimings.spacing = 5; 

    var layerTimingsText = layerTimings.add('statictext', undefined, undefined, {name:'layerTimingsText'});
        layerTimingsText.text = "Layer Timings:"

    var compRelativeTiming = layerTimings.add("radiobutton", undefined, undefined, {name:"compRelativeTiming"});
        compRelativeTiming.text = "Relative to Comp";
        compRelativeTiming.value = true;
    
    var markerRelativeTiming = layerTimings.add("radiobutton", undefined, undefined, {name:"markerRelativeTiming"});
        markerRelativeTiming.text = "Relative to Closest Previous Comp Marker (Cuing Style)"

    // CHECKBOXES
    // ==========
    var checkboxes = dialog.add("group", undefined, {name: "checkboxes"}); 
        checkboxes.orientation = "column"; 
        checkboxes.alignChildren = ["center","center"]; 
        checkboxes.spacing = 0; 
        checkboxes.margins = 0; 

    var statictext1 = checkboxes.add("statictext", undefined, undefined, {name: "statictext1"}); 
        statictext1.text = "Include:"; 

    var btnCue = checkboxes.add("checkbox", undefined, undefined, {name:'btnCue'});
        btnCue.text = "Cue (Comp Markers)";
        btnCue.value = true;

    var btnBlendMode = checkboxes.add("checkbox", undefined, undefined, {name: "btnBlendMode"}); 
        btnBlendMode.text = "Blend Mode"; 
        btnBlendMode.value = true;

    var btnInPntSF = checkboxes.add("checkbox", undefined, undefined, {name: "btnInPntSF"}); 
        btnInPntSF.text = "In-Point (s:f)"; 
        btnInPntSF.value = true;

    var btnInPntS = checkboxes.add("checkbox", undefined, undefined, {name: "btnInPntS"}); 
        btnInPntS.text = "In-Point (s)"; 

    var btnInPntF = checkboxes.add("checkbox", undefined, undefined, {name: "btnInPntF"}); 
        btnInPntF.text = "In-Point (f)";
        
    var btnComment = checkboxes.add("checkbox", undefined, undefined, {name: "btnComment"}); 
        btnComment.text = "Comments";
        btnComment.value = true;

    var btnTrackMattes = checkboxes.add("checkbox", undefined, undefined, {name: "btnTrackMattes"}); 
        btnTrackMattes.text = "Track Mattes";
        btnTrackMattes.value = true;
        
    var btnFadeInTime = checkboxes.add("checkbox", undefined, undefined, {name: "btnFadeInTime"});
        btnFadeInTime.text = "Fade In Length";

    var btnFadeOutTime = checkboxes.add("checkbox", undefined, undefined, {name: "btnFadeOutTime"});
      btnFadeOutTime.text = "Fade Out Length";

    var btnSourceIn = checkboxes.add("checkbox", undefined, undefined, {name:"btnSourceIn"});
        btnSourceIn.text = "Source In (TC)";

    var btnSourceOut = checkboxes.add("checkbox", undefined, undefined, {name:"btnSourceOut"});
        btnSourceOut.text = "Source Out (TC)";
        
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
        btnCancel.text = "Exit"; 

    // Button Functionality
    btnExport.onClick = function() {
    layerTimingsRelative = compRelativeTiming.value;
      exportOptions = [
        {
            info: 'Cue',
            shouldExport: btnCue.value,
            generateInfo: function(layer) {
                var cue = getClosestCompMarker(layer, layer.inPoint);
                return ',"' + cue.cueName + '"';
            }
        },
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
                var timing = 0;
                if (layerTimingsRelative) {
                    timing = layer.inPoint - getClosestCompMarker(layer,layer.inPoint).closestTime;
                } else { timing = layer.inPoint };
                var inPointSecondsTruncate = (Math.floor(timing));
                var inPointFrames = timing * layer.containingComp.frameRate;
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
                var timing = 0;
                if (layerTimingsRelative) {
                    timing = layer.inPoint - getClosestCompMarker(layer,layer.inPoint).closestTime;
                } else { timing = layer.inPoint };
                var inPointSeconds = (timing).toFixed(2);
                return "," + inPointSeconds;
            } 
        },
        { 
            info: 'In-Point (frame)',
            shouldExport: btnInPntF.value,
            generateInfo: function(layer) {
                var timing = 0;
                if (layerTimingsRelative) {
                    timing = layer.inPoint - getClosestCompMarker(layer,layer.inPoint).closestTime;
                } else { timing = layer.inPoint };
                var inPointFrames = timing * layer.containingComp.frameRate;
                inPointFrames = Math.round(inPointFrames);
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
            
        },
        { 
            info: 'Source In (TC)', 
            shouldExport: btnSourceIn.value,
            generateInfo: function(layer) {
                var frameRate = layer.containingComp.frameRate;
                var sourceIn = layer.inPoint - layer.startTime;  // In-point relative to source
                return "," + timeToCurrentFormat(sourceIn, frameRate);
            } 
        },
        { 
            info: 'Source Out (TC)', 
            shouldExport: btnSourceOut.value,
            generateInfo: function(layer) {
                var frameRate = layer.containingComp.frameRate;
                var sourceOut = layer.outPoint - layer.startTime;  // Out-point relative to source
                return "," + timeToCurrentFormat(sourceOut, frameRate);
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
    // OPEN NEW CSV FILE
    saveFile.open("w");
    // WRITE THE HEADER LINES BASED OFF WHAT EXPORT OPTIONS ARE SELECTED
    headerLine = "Layer Name"
    for (i = 0; i < exportOptions.length; i++) {
      if (exportOptions[i].shouldExport) {
        headerLine += "," + exportOptions[i].info;
      }
    }
    saveFile.writeln(headerLine);
    // Loop through the layers and write their information to the CSV
    var selectedLayers = comp.selectedLayers;
    var compLayers = comp.layers;
    var exportCount = 0;
    if (selectedLayers != 0) {
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
    } else {
        for (var i = 1; i <= compLayers.length; i ++) {
            var layer = compLayers(i);
            var layerName = '"' + layer.name + '"';
            // Exclude Shy and Guides
            if (layer && !layer.shy && !layer.guideLayer) {
              // alert("Found layer " + layerName +", exporting.")     
              saveFile.writeln(layerName + makeLayerInfo(layer))
              exportCount++; 
            }
        }
    }
    saveFile.close();
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

function getClosestCompMarker(layer, timeMark) {
    var comp = layer.containingComp;
    var timePoint = timeMark;
    var markers = comp.markerProperty;
    var closestTime = comp.displayStartTime; // Default to start of the comp
    var closestMarker = null;
    var cueName = "";

    if (markers.numKeys > 0) {
        var minDelta = Math.abs(timePoint - closestTime);

        for (var i = 1; i <= markers.numKeys; i++) {
            var markerTime = markers.keyTime(i);
            if (markerTime <= timePoint) {
                var delta = Math.abs(timePoint - markerTime);

                if (delta < minDelta) {
                    minDelta = delta;
                    closestTime = markerTime;
                    closestMarker = markers.keyValue(i);
                }
            } else if (markerTime > timePoint) {
                break;
            }
        }
    }

    if (closestMarker == null) {
        cueName = "Assembly Start"
    } else {
        cueName = closestMarker.comment;
    }
    return { 
        closestTime: closestTime,
        cueName: cueName
    };
}

function formatTimecode(seconds, frameRate) {
    var isDropFrame = Math.abs(frameRate - 29.97) < 0.01; // Check if it's 29.97 fps
    var framesPerHour = Math.round(frameRate * 3600);
    var framesPerMinute = Math.round(frameRate * 60);
    var totalFrames = Math.round(seconds * frameRate);

    var dropFrames = 0;
    if (isDropFrame) {
        dropFrames = Math.round(frameRate * 0.066666); // 2 frames per minute
    }

    // Drop-frame adjustment
    if (isDropFrame) {
        var totalMinutes = Math.floor(totalFrames / framesPerMinute); // Total elapsed minutes
        var droppedFrames =
            dropFrames * (totalMinutes - Math.floor(totalMinutes / 10)); // Account for non-dropped 10th minutes
        totalFrames += droppedFrames;
    }

    // Calculate hours, minutes, seconds, and frames
    var hours = Math.floor(totalFrames / framesPerHour);
    totalFrames %= framesPerHour;

    var minutes = Math.floor(totalFrames / framesPerMinute);
    totalFrames %= framesPerMinute;

    var seconds = Math.floor(totalFrames / frameRate);
    var frames = Math.round(totalFrames % frameRate);

    // Format as HH:MM:SS:FF
    var timecode = [
        ("0" + hours).slice(-2),
        ("0" + minutes).slice(-2),
        ("0" + seconds).slice(-2),
        ("0" + frames).slice(-2),
    ].join(":");

    return timecode;
}

function main() {
    // Primary function
    var projectSelection = app.project.selection;
    var activeComp = app.project.activeItem;
    if (projectSelection && projectSelection > 1) {
        for (i = 0; i < projectSelection.length; i++) {
            if (projectSelection[i] instanceof CompItem) {
                exportLayerInfoToCSV(activeComp);
            }
        }
    } else if (activeComp && activeComp instanceof CompItem) {
        exportLayerInfoToCSV(activeComp);
    } else {
        alert("Please select or open a composition first.");
    }
}

createUI();

