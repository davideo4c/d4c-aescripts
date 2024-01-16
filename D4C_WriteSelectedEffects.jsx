// Function to generate a CSV string from the effects data
function generateCSV(effectsData) {
    var csv = "Layer,Effect Name,Match Name\n";
    for (var i = 0; i < effectsData.length; i++) {
        csv += effectsData[i].layer + "," + effectsData[i].effectDisplayName + "," + effectsData[i].effectMatchName + "\n";
    }
    return csv;
}

// Function to get effects data from a composition
function getEffectsData(comp) {
    var effectsData = [];
    for (var j = 1; j <= comp.layers.length; j++) {
        var layer = comp.layers[j];
        for (var k = 1; k <= layer.property("ADBE Effect Parade").numProperties; k++) {
            var effect = layer.property("ADBE Effect Parade").property(k);
            effectsData.push({
                layer: layer.name,
                effectDisplayName: effect.name,
                effectMatchName: effect.matchName
            });
        }
    }
    return effectsData;
}

// Main function to be called
function main() {
    // Get the selected composition
    var selectedComp = app.project.activeItem;

    // Check if the selected item is a composition
    if (selectedComp instanceof CompItem) {
        // Get effects data
        var effectsData = getEffectsData(selectedComp);

        // Generate CSV string
        var csvContent = generateCSV(effectsData);

        // Create a save file dialog
        var file = File.saveDialog("Save Effects Data as CSV", "*.csv");
        
        // Check if the user clicked cancel
        if (file !== null) {
            // Write CSV content to the file
            file.open("w");
            file.write(csvContent);
            file.close();
            alert("CSV file saved successfully!");
        } else {
            alert("Operation canceled.");
        }
    } else {
        alert("Please select a composition.");
    }
}

// Run the main function
main();
