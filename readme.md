# Custom elements for Kentico Cloud
##### (The best headless CMS in the cloud)

This repository contains several (at least one... Hey it's a start.) custom content elements for the [Kentico Cloud](https://kenticocloud.com/) platform.

If you want more information on Kentico Cloud, [head here](https://kenticocloud.com/docs-and-tutorials), or [contact us via email](mailto:cloud@kentico.com).

If you're familiar with the CMS, but would like to know more about custom elements, [you might find this interesting](https://developer.kenticocloud.com/docs/integrating-content-editing-features).

## How to use this repository

### Scripts

`npm start` will start the server script in default configuration. For more info about configuration run `npm start -- --help` (For `npm` wants the argument vector for the command it's running after `--`.)

`npm run start-watcher` will start the node server and a compiler watching for changes in the files compiled for the client-side. This is useful when you're trying to create or debug your custom elements.

If you leave this running on a publicly accessible server, you'll be able to use all the elements served by the server in the cloud. The URL is in this format: `<the root to your instance>/custom-elements/<element name>`.

What `<element name>` stands for is dealt with below, read on.

`npm run tslint` is here to give a bit of culture to the code and avoid unnecessary mistakes.

`npm run typecheck` is here to simply check for type errors when you're ready to do so.

`npm run typewatch` is your friend, when you want to have the type-check result ready all the time.

### Adding custom elements

Put very simply, just follow the example. The "sheets" elements was the first one here and is done according to several conventions:
1) Its files are located in _\<root\>/client/custom-elements/\<element name\>/_

   Now you know what the _\<element name\>_ is. It's the name of the folder the element's source code is in.
1)  There's a view file in the ['.pug' format](https://pugjs.org/api/getting-started.html) called index.pug.

1) A typescript file bearing whatever name as long as it ends with '.ts' or '.tsx'. 

   If several files are present, it should work in theory, but make sure they don't reference each other. In such case they would probably be included more than once. I need to try this out.

1) The stylesheet is in ['.less'](http://lesscss.org/), ['.styl' (stylus)](http://stylus-lang.com/) or ['.css'](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/How_CSS_works) format and is imported from within the typescript code.

## Plans
1) Add options to inline CSS and JS into server's HTML output - DONE
1) Add compilation into HTML - DONE
   1) With or without CSS and JS inlining - DONE
1) Add stylus support - DONE
1) Better usage guide
1) Hot reload if possible
