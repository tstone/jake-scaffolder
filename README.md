jake-scaffolder
===============

The purpose of jake-scaffolder is to make it easier to create Jakefiles which generate files, particularly those with a lot of boilerplate.

### Let's do a scenario

Say you write a lot of jQuery plugins and you want to make a fast way within your project to create a new one.  You want to run the command

```
$ jake newplugin[Example]
```

And have a file that looks like this, automatically be created in `./plugins/example.jquery.js`:

```
(function($) {
    $.fn.example = function(method) {

    };
}(window.jQuery));
```

So let's start simple.  You create a new `Jakefile` in your project root and setup a blank task...

```
desc('Create a new jQuery Plugin');
task('newplugin', function(pluginName){
    
});
```

Great.  So the first thing we need to take care of, is we don't want to accidentally create a new boilerplate file over top of a file that already exists.  Jake-scaffolder gives us an easy way to do this.  Let's update our task in the Jakefile.

```
var scaffold = require('jake-scaffolder').scaffold;

desc('Create a new jQuery Plugin');
task('newplugin', function(pluginName){
    scaffold(function(act, need, conf){
        // Context
        conf.set('pluginName', pluginName);

        // Prereqs
        need.fileDoesntExist('./plugin/[pluginName.lower].jquery.js');

    });
});
```

If we were to run the task right now, and the file existed, we'd get an error on the console:

```
$ jake newplugin[example]

  =>  C:\Example\plugin\example.jquery.js already exists. Quitting.

```

Cool. Now that we think about it, we should probably make sure the `/plugins/` directory exists too, so our scaffolding script doesn't barf all over itself if we later rename that folder.

```
desc('Create a new jQuery Plugin');
task('newplugin', function(pluginName){
    scaffold(function(act, need, conf){
        // Context
        conf.set('pluginName', pluginName);
                
        // Prereqs
        need.dirExists('./plugins');
        need.fileDoesntExist('./plugins/[pluginName.lower].jquery.js');

    });
});
```

So far, not so bad, right?  If we were to run our task nothing much exciting would happen.  The real meat of the task is generating a new file, so let's get to that.

We need a place to store our boilerplate templates for easy access, so we'll create a new folder in `./_jaketemplates` in our project dir.  In this folder, we'll create a new file.

```
// file: plugin-boilerplate.js
(function($) {
    $.fn.[pluginName.lower] = function(method) {

    };
}(window.jQuery));
```

We can now update our task to generate a new version of that file when the task is run.

```
desc('Create a new jQuery Plugin');
task('newplugin', function(pluginName){
    var newPluginPath = './plugins/[pluginName.lower].jquery.js';
    scaffold(function(act, need, conf){        
        // Context
        conf.set('pluginName', pluginName);
        
        // Prereqs
        need.dirExists('./plugins');
        need.fileDoesntExist(newPluginPath);

        // Generate
        act.renderFile('./_jaketemplates/plugin-boilerplate.js', newPluginPath);
    });
});
```

Running the task, we'd then end up with a new file in our `/plugins/` folder.

```$ jake newplugin[example]```

After a little while you realize you're also often createing a CSS file to go with the plugin, and putting it in it's own sub-directory.

We can go back to our `_jaketemplate` folder and now create the following...

```
./_jaketemplate
   /newplugin
      /[pluginName.lower].jquery.js
      /[pluginName.lower].jquery.css
```

Our task gets updated with a few minor changes.

```
desc('Create a new jQuery Plugin');
task('newplugin', function(pluginName){
    scaffold(function(act, need, conf){
        // Context
        conf.set('pluginName', pluginName);
        
        // Prereqs
        need.dirExists('./plugins');
        need.dirEmpty('./plugins/' + pluginName);

        // Generate
        act.mkdir('./plugins/' + pluginName)
        act.renderFolder('./_jaketemplates/newplugin', './plugins/' + pluginName);
    });
});
```

And that's what jake-scaffold does.  There are a lot more tricks it has up it's sleeve.  Check out the (future) wiki for more details.

## Need

The following methods are supported.

```
need.exists(file)           // The file or directory must exist to continue
need.fileExists(file)       // Same as .exists, but a clearer name
need.dirExists(dir)         // Same as .exists, but a clearer name
need.doesntExist            // The file or directory must not exist to continue
need.fileDoesntExist        // Same as .doesntExist, but a clearer name
need.dirDoesntExist         // Same as .doesntExist, but a clearer name
need.dirEmpty               // The directory must have no files in it to continue
need.dirNotEmpty            // The directory must have at least one file in it to continue
```

## Act

The following actions are supported.

```
act.mkdir(dir)                                  // Create the specified directory
act.createFile(content, dest)                   // Create a new file, with the given content
act.createEmptyFile(dest)                       // Create a new, blank file
act.renderStringToFile(str, dest)               // Render the string and save it to a new file
act.renderFile(source, dest)                    // Render a template file (source)
act.renderFolder(source, dest)                  // Render every file in the dir to the destination dir
act.replaceInFile(source, find, repl, options)  // Replace the "find" within the source with "repl"
act.replaceInDir(source, find, repl, options)   // Replace the "find" within the source with "repl" for every file in the source dir
```

## Conf

Any arbitrary value can be added to conf.  The values on conf will be available when rendering.

```
conf.get(key)               // Return the current value of key
conf.set(key, val)          // Set the value of key to val
```

In addition, there are some special conf values that do things.

```
templateDir                 // The default location for templates when rendering a file/folder
startTag                    // The start of the replace tag.  Default:  \\[
endTag                      // The end of the replace tag.  Default:  \\]
```