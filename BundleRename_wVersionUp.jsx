/**
	BUNDLE RENAME FOR AFTER EFFECTS
	V.04 (JULY 3RD 2024)
	DAVID4C.COM
	BASED OFF INITIAL CODE FROM THE GUY WHO RUNS CRGREEN.COM
**/
var win = new Window('dialog', 'Rename Project Items');

// Define the regex patterns for tags, descriptions, and versions.
var tagPattern = /\d{3}-\d{3}-/;
// var descPattern = /(-[^CH\d*?].*?(?=_Build_|_V|_v|_Previs3D_|$))/;
var descPattern = /-(?!\d{3}|CH\d)(.*?)(?=_Build_|_V|_v|_Previs3D_|$)/;
var versionPattern = /_[v|V]\d*/;
var templateTagPattern = /\%SCENE-\%SET-/;

var mySelection = app.project.selection;
if ( mySelection.length == 0 ) {
	alert("No Project Items selected.");
} else {
	var nameTemplates = [];
	for(i=0;i<mySelection.length;i++) {
		var theSplit = mySelection[i].name.split("-");
		if (theSplit.length > 0) {
			for (j=0; j<theSplit.length; j++)
				nameTemplates.push(theSplit[j]);
		}
	}

	var w = buildUI(nameTemplates);
	if (w != null)
		w.show();
}

function buildUI(ddItems) {
	if (win != null) {

		win.cbPnl = win.add("panel", undefined, "Wildcards"); 
		win.cbPnl.orientation = "row";
		// A
		// win.cbPnl.gA = win.cbPnl.add("group",undefined,"");
		// win.cbPnl.lA = win.cbPnl.gA.add("statictext",undefined,"A##S##");
		// win.cbPnl.lA.alignment = "top";
		// win.cbPnl.gA.orientation = "column";
		// win.cbPnl.wA = win.cbPnl.gA.add("edittext",undefined,"");
		// win.cbPnl.wA.alignment = "bottom";
		// win.cbPnl.wA.size = [50, 20]
		// win.cbPnl.sA = win.cbPnl.add("statictext",undefined," - ");

		// C
		win.cbPnl.gC = win.cbPnl.add("group",undefined,"");
		win.cbPnl.lC = win.cbPnl.gC.add("statictext",undefined,"Asset ###-###");
		win.cbPnl.lC.alignment = "top";
		win.cbPnl.gC.orientation = "column";
		win.cbPnl.wC = win.cbPnl.gC.add("edittext",undefined,"");
		win.cbPnl.wC.alignment = "bottom";
		win.cbPnl.wC.size = [50, 20]
		win.cbPnl.sC = win.cbPnl.add("statictext",undefined," - ");		
		
		// D
		win.cbPnl.gD = win.cbPnl.add("group",undefined,"");
		win.cbPnl.lD = win.cbPnl.gD.add("statictext",undefined,"Desc");
		win.cbPnl.lD.alignment = "top";
		win.cbPnl.gD.orientation = "column";
		win.cbPnl.wD = win.cbPnl.gD.add("edittext",undefined,"");
		win.cbPnl.wD.alignment = "bottom";
		win.cbPnl.wD.size = [240, 20]		
		
		// B
		win.cbPnl.gB = win.cbPnl.add("group",undefined,"");
		win.cbPnl.lB = win.cbPnl.gB.add("statictext",undefined,"Version##");
		win.cbPnl.lB.alignment = "top";
		win.cbPnl.gB.orientation = "column";
		win.cbPnl.wB = win.cbPnl.gB.add("edittext",undefined,"");
		win.cbPnl.wB.alignment = "bottom";
		win.cbPnl.wB.size = [50, 20]
		win.cbPnl.sB = win.cbPnl.add("statictext",undefined," - ");

		win.srchPnl = win.add("panel", undefined, "Search and Replace / Append"); 
		nameSearchLabel = win.srchPnl.add('statictext', undefined, 'Search in Names:');
		nameSearchLabel.alignment = "left";
		win.nameSearchT = win.srchPnl.add('edittext', undefined, '');
		win.nameSearchT.size = [318, 20];
		win.nameSearchT.alignment = "left";

		win.nameDropDown = win.srchPnl.add('dropdownlist', undefined, ddItems);
		win.nameDropDown.alignment = "left";
		win.nameDropDown.onChange = function() {
			win.nameSearchT.text = this.selection.text;
		}
		
		win.nameReplaceLabel = win.srchPnl.add('statictext', undefined, 'Replace with:');
		win.nameReplaceLabel.alignment = "left";
		win.nameReplaceT = win.srchPnl.add('edittext', undefined, '');
				win.nameReplaceT.size = [318, 20];
		win.nameReplaceT.alignment = "left";
		win.typePnl = win.srchPnl.add('group', undefined, 'Rename Type:');
		win.typePnl.alignment = "left";
		win.typePnl.orientation = "row";
		
		win.repRad = win.typePnl.add('radiobutton', undefined, 'Search and Replace');
		win.repRad.alignment = "left";
		win.repRad.value = true;
		win.repRad.onClick = function () {
			doTextChange(win.nameSearchLabel, 'Search in Names:');
			doTextChange(win.nameReplaceLabel, 'Replace with:');
		};
		win.appRad = win.typePnl.add('radiobutton',undefined, 'Append');
		win.appRad.alignment = "right";
		win.appRad.onClick = function () {
			doTextChange(win.nameSearchLabel, 'Append Head with:');
			doTextChange(win.nameReplaceLabel, 'Append Tail with:');
		};

		win.optionsPnl = win.add("panel", undefined, "Options"); 
		win.optionsPnl.size = [340,60];
		win.recurse = win.optionsPnl.add("checkbox",undefined,'Recursively replace in folders');
		win.recurse.alignment = "left";
		win.recurse.value = true;
		
		win.btn = win.add('group', undefined, '');
		win.btn.alignChildren = "left";
		win.btn.orientation = "row";
		
		win.cancBtn = win.btn.add('button', undefined, 'Cancel', {name:'Cancel'});
		win.cancBtn.onClick = function () {this.parent.parent.close(1)};
		win.cancBtn.alignment = "left";
		
		win.okBtn = win.btn.add('button', undefined, 'OK', {name:'OK'});
		win.okBtn.onClick = function () { doRenaming(this.parent.parent); };
		win.okBtn.alignment = "left";

        win.okBtn = win.btn.add('button', undefined, 'Just Version Up', {name:'VersionUp'});
		win.okBtn.onClick = function () { doVersioning(this.parent.parent); };
		win.okBtn.alignment = "left";

	}
	return win
}

function doTextChange(target, newText) {
	target.text = newText;
}

function renameItem (theDialog,theItem) {

	var myItems = [];
	var oldName = theItem.name;
	var sear = theDialog.nameSearchT.text;
	var repl = theDialog.nameReplaceT.text
	var newName = oldName;
	var i;
				
	//do all the wildcard stuff
	// if (!((theDialog.cbPnl.wA.text == '') && (theDialog.cbPnl.wB.text == '') && (theDialog.cbPnl.wC.text == '') && (theDialog.cbPnl.wD.text == ''))) {
	if (!((theDialog.cbPnl.wC.text == '') && (theDialog.cbPnl.wD.text == ''))) {	
		// newName = newName.replace("%AS",theDialog.cbPnl.wA.text);
		newName = newName.replace("%VER",theDialog.cbPnl.wB.text);
		newName = newName.replace("%TAG",theDialog.cbPnl.wC.text);
		newName = newName.replace("%DESC",theDialog.cbPnl.wD.text);
	}

	/** -- MAR '24 ADDITIONS FROM DAVID FORSEE (DAVID4C.COM) -- REGEX MATCHING FOR WILDCARDS -- **/

	// regex match the asset number
	if (!(theDialog.cbPnl.wC.text == '')) {
		if (tagPattern.test(newName)) {
			newName = newName.replace(tagPattern, theDialog.cbPnl.wC.text + "-");
		} else if (templateTagPattern.test(newName)) {
            newName = newName.replace(templateTagPattern, theDialog.cbPnl.wC.text + "-");
        }
	}

	// regex match the version number
	if (!(theDialog.cbPnl.wB.text == '')) {
		if (versionPattern.test(newName)) {
			newName = newName.replace(versionPattern, "_v" + theDialog.cbPnl.wB.text);
		}
	}

	// regex match the description
	if (!(theDialog.cbPnl.wD.text == '')) {
		if (descPattern.test(newName)) {
			newName = newName.replace(descPattern, "-" + theDialog.cbPnl.wD.text);
		}
	}

	// then do the search/replace stuff
	if (sear != '') {
		if (theDialog.repRad.value) {
			// first check that we're not replacing with the same term; if so, just do the replace once
			if (repl.indexOf(sear) != -1) {
				newName = (newName.replace(sear, repl));
			} else {
				//keep renaming until searchstring is no longer in name:					
				while (newName.indexOf(sear) != -1) {
					newName = (newName.replace(sear, repl));
				}
			}
		} 
		else if (theDialog.appRad.value) {
				newName=(sear + oldName + repl );
		} 
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
			renameItem(theDialog,myItems[i]);
	}
}

function versionItem (theDialog,theItem) {

	var myItems = [];
	var oldName = theItem.name;
	var sear = theDialog.nameSearchT.text;
	var repl = theDialog.nameReplaceT.text
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

        // then do the search/replace stuff
        if (sear != '') {
            if (theDialog.repRad.value) {
                // first check that we're not replacing with the same term; if so, just do the replace once
                if (repl.indexOf(sear) != -1) {
                    newName = (newName.replace(sear, repl));
                } else {
                    //keep renaming until searchstring is no longer in name:					
                    while (newName.indexOf(sear) != -1) {
                        newName = (newName.replace(sear, repl));
                    }
                }
            } 
            else if (theDialog.appRad.value) {
                    newName=(sear + oldName + repl );
            } 
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
			versionItem(theDialog,myItems[i]);
	}
}

function doRenaming(theDialog) {
	// make sure comps are selected
	var mySelection = app.project.selection;
	selectedObs = [];
	
		
	if ( mySelection.length == 0 ) {
		alert("No Project Items selected.");
		theDialog.close(1);
	} else {
		var s = [];
		var selNum = mySelection.length;
		var inputError = false;
		
		app.beginUndoGroup("the renaming of project items");
		for(i=0;i<mySelection.length;i++)
			s[i] = mySelection[i];
			
		for(i=0;i<mySelection.length;i++)
			renameItem(theDialog,s[i]);

		app.endUndoGroup();
		theDialog.close(1);
	}
}

function doVersioning(theDialog) {
	// make sure comps are selected
	var mySelection = app.project.selection;
	selectedObs = [];
	
		
	if ( mySelection.length == 0 ) {
		alert("No Project Items selected.");
		theDialog.close(1);
	} else {
		var s = [];
		var selNum = mySelection.length;
		var inputError = false;
		
		app.beginUndoGroup("the versioning of project items");
		for(i=0;i<mySelection.length;i++)
			s[i] = mySelection[i];
			
		for(i=0;i<mySelection.length;i++)
			versionItem(theDialog,s[i]);

		app.endUndoGroup();
		theDialog.close(1);
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