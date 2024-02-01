function main() {// Check if After Effects is running
if (app && app.project) {
        // Get user input for the text to be added
    var userText = prompt("Enter the comment to be added:", "ALPHA");

    // Check if the user clicked cancel or entered an empty string
    if (userText === null || userText === "") {
        alert("Operation canceled. Please enter valid text.");
        return;
    }
    
    // Get the selected items in the Project Window
    var selectedItems = app.project.selection;
  
    // Loop through each selected item
    for (var i = 0; i < selectedItems.length; i++) {
      var currentItem = selectedItems[i];
  
      // Check if the selected item is a composition
      if (currentItem instanceof CompItem) {
        // Add the userText to the composition
        currentItem.comment = userText;
      }
    }
  
    // Alert the user that the process is complete
    alert("Comments added to selected compositions.", "Script Complete");
  } else {
    // Alert the user if After Effects is not running
    alert("After Effects is not running.", "Error");
  }
}

main();