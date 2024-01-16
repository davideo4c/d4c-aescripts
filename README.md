# d4c-aescripts
Helpful, simple, utility scripts for After Effects (with a bias for live performance)

## Installation
When After Effects starts, it loads scripts from the Scripts folder. By default, the Scripts folder is in the following locations for After Effects:
```
Windows: Program Files\Adobe\Adobe After Effects <version>\Support Files

macOS: Applications/Adobe After Effects <version>
```
**Download any of the above scripts (the .JSX files) and place them in the above directory.**

Note: By default, some of these scripts are not allowed to write files or send or receive communication over a network. To allow scripts to write files and communicate over a network in After Effects,
```
Windows: Select Edit > Preferences > Scripting & Expressions > select Allow Scripts To Write Files And Access Network.

macOS: Select After Effects > Preferences > Scripting & Expressions > select Allow Scripts To Write Files And Access Network.
```
## Running a Script
To run a loaded script, choose File > Scripts > [script name].

To run a script that was not installed in the Scripts folder, choose File > Scripts > Run Script File, locate and select a script, and select Open.

To stop a running script, press Esc.
## Scripts
- **Layer Info to CSV:** Export the blending mode, in-points in seconds:frames, seconds, and frames of each selected layer in a composition as a CSV. Helpful when programming disguise timelines from an assembly composition made of many smaller clips.
- **Replace Effects**: Replaces all instances of an effect with another in selected compositions in the project panel. Works with internal match names and basic display names. Generally speaking, you would want to use the [match names](https://ae-scripting.docsforadobe.dev/matchnames/effects/firstparty.html)  of an effect.
- **Write Selected Effects**: Makes a CSV of the internal match name and display name of an effect. Mostly for debugging effect names.

### Roadmap
- Layer Info to CSV: Make this a more interactive script UI that allows you to select different aspects of the layer's information to export.
