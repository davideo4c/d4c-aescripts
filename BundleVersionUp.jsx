/**
	BUNDLE JUST VERSION UP FOR AFTER EFFECTS
	V.04 (SEPT 4th 2024)
	DAVID4C.COM
	BASED OFF INITIAL CODE FROM THE GUY WHO RUNS CRGREEN.COM
**/
var versionPattern = /_[v|V]\d*/;
var mySelection = app.project.selection;
if ( mySelection.length == 0 ) {
	alert("No Project Items selected.");
} else {
	doVersioning();
}

function doTextChange(target, newText) {
	target.text = newText;
}

function versionItem (theItem) {

	var myItems = [];
	var oldName = theItem.name;
	var newName = oldName;
	var i;

    var versionPattern = /_[vV](\d+)/;

    if (versionPattern.test(newName)) {
        // Increment the version number while preserving leading zeros
        newName = newName.replace(versionPattern, function(match, p1) {
            var parsedVersion = parseInt(p1, 10);
            var incrementedVersion = parsedVersion + 1;
            var newVersion = padVersion(incrementedVersion, p1.length); // Manually pad with leading zeros
            return "_v" + newVersion; // Replace with incremented version
        });
    }
    
	// names can only be 160 chars
	newName=(newName.substr(0,160));
	theItem.name = newName;
	app.project.autoFixExpressions(oldName, newName);
	
	//recurse through if it is a folder
	if (theItem.typeName == "Folder")
	{	
			// It turns out that if you change the name and it effects sort order, then the index changes.  So first we create a local array of items, and then we iterate that.
		for(i=1;i<=theItem.items.length;i++)
			myItems[i] = theItem.items[i];

		for(i=1;i<=theItem.items.length;i++)
			versionItem(myItems[i]);
	}
}
function doVersioning() {
	// make sure comps are selected
	var mySelection = app.project.selection;
	selectedObs = [];
	
		
	if ( mySelection.length == 0 ) {
		alert("No Project Items selected.");
	} else {
		var s = [];
		var selNum = mySelection.length;
		var inputError = false;
		
		app.beginUndoGroup("the versioning of project items");
		for(i=0;i<mySelection.length;i++)
			s[i] = mySelection[i];
			
		for(i=0;i<mySelection.length;i++)
			versionItem(s[i]);

		app.endUndoGroup();
	}
}
// Function to pad version number with leading zeros
function padVersion(number, length) {
    var str = number.toString();
    while (str.length < length) {
        str = '0' + str; // Add leading zeros
    }
    return str;
}