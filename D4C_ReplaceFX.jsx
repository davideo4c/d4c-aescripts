// Define the old and new effect names as variables
var oldEffectName = "";
var newEffectName = "";

// Function to create the UI panel
function createUI() {
    var win = new Window("palette", "Replace Effects in Selected Comps", undefined);
    win.alignChildren = ['left','top'];
    var replaceGroup = win.add("group", undefined, {name: "replaceGroup"}); 
    replaceGroup.orientation = "row"; 
    replaceGroup.alignChildren = ["left","center"]; 
    replaceGroup.spacing = 10; 
    replaceGroup.margins = 0; 

    // Add information text
    var infoText = replaceGroup.add("statictext", undefined, "Replace Effect:");

    // Add text entry for old effect name
    var oldEffectText = replaceGroup.add("edittext", undefined, oldEffectName);
    oldEffectText.characters = 20;
    oldEffectText.active = true;

    var newFXGroup = win.add("group", undefined, {name: "replaceGroup"}); 
    newFXGroup.orientation = "row"; 
    newFXGroup.alignChildren = ["left","center"]; 
    newFXGroup.spacing = 10; 
    newFXGroup.margins = 0; 

    var infoText = newFXGroup.add("statictext", undefined, "With:");

    // Add text entry for new effect name
    var newEffectText = newFXGroup.add("edittext", undefined, newEffectName);
    newEffectText.characters = 20;

    var btnGroup = win.add("group", undefined, {name: "replaceGroup"}); 
    btnGroup.orientation = "row"; 
    btnGroup.alignChildren = ["left","center"]; 
    btnGroup.spacing = 10; 
    btnGroup.margins = 0;

    // Add buttons
    var cancelButton = btnGroup.add("button", undefined, "Cancel");
    var replaceButton = btnGroup.add("button", undefined, "Replace");
    
    // Button event handlers
    cancelButton.onClick = function () {
        win.close();
    };

    replaceButton.onClick = function () {
        oldEffectName = oldEffectText.text;
        newEffectName = newEffectText.text;
        replaceEffects();
        win.close();
    };

    win.show();
}

// Function to iterate through all comps and replace effects
function iterateCompsAndReplaceEffects(selections) {
    var replacementCount = 0;

    // Iterate through all comps or folders
    for (var i = 0; i < selections.length; i++) {
        var currentItem = selections[i];

        // Check if the item is a composition
        if (currentItem instanceof CompItem) {
            // Iterate through all layers in the composition
            for (var j = 1; j <= currentItem.layers.length; j++) {
                var currentLayer = currentItem.layers[j];
                // Iterate through all effects in the layer if layer possesses them
                if (currentLayer.property("Effects") != null) {
                    for (var k = 1; k <= currentLayer.property("Effects").numProperties; k++) {
                        var effect = currentLayer.property("Effects").property(k);
                        // Check if the effect matches either the internal match name or display name
                        if (effect.matchName == oldEffectName || effect.name == oldEffectName) {
                            // Store index of old effect and remove
                            fxIndex = effect.propertyIndex;
                            effect.remove();
                            // Add the new effect, place in the proper index
                            newEffect = currentLayer.property("Effects").addProperty(newEffectName);
                            newEffect.moveTo(fxIndex);
                            // Increment the replacement count
                            replacementCount++;
                        }
                    }
                }  
            }
        } else if (currentItem instanceof FolderItem) {
            // Recursive call for folders
            replacementCount += iterateCompsAndReplaceEffects(currentItem);
        }
    }

    return replacementCount;
}

// Function to replace effects based on user input
function replaceEffects() {
    var replacementCount = iterateCompsAndReplaceEffects(app.project.selection);
    alert("Replaced " + replacementCount + " instances of the '" + oldEffectName + "' effect with '" + newEffectName + "'.");
}

// Main function to be called
function main() {
    // Call the function to create the UI panel
    createUI();
}

app.beginUndoGroup("Replace Effect References");
main();
app.endUndoGroup();
