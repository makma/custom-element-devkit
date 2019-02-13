# Custom elements for Kentico Cloud server and compilation

## The `npm start` script

You can take a look in the [package.json](../package.json) the script for start launches a [ts-node](https://github.com/TypeStrong/ts-node) instance. It's a [node.js](https://nodejs.org/en/) instance capable of interpreting typescript put simply.

This node instance parses the argument vector (options and params) and based on that starts the server, compiler or even a file system watcher.

The starting point for the node instance is [server.ts](./server.ts). The ts-node will start even if there are type-errors within the server-side code. There's the `npm run typecheck` command to run a full type check.

## Compilation

When you tell the server you want to build the custom elements in any way (`-c`, `-b` or `-w`), it will go through the [client/custom-elements](../client/custom-elements) directory and look for custom elements.

Once it has the list of custom elements, it create [webpack entries](https://webpack.js.org/concepts/entry-points/) for each one.

Then it runs webpack via the [webpack api](https://webpack.js.org/api/node/). (As opposed to the [CLI](https://webpack.js.org/api/cli), you're probably used to.)

When webpack is done compiling, the server reports the result to the console.

## The server

When `-h` is used as an option for the program, an [express](https://expressjs.com/) server instance is spun up. It uses _https:_ protocol, since it's required by Kentico Cloud in order not to [mix secure and unsecure content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/fixing-mixed-content) on one page. 

It responds to two routes:

1) The custom element route in the form of `/custom-elements/:elementName`: 

   It renders the element's 

   If the element cannot be found, you'll get information that should help you identify why that is. 

1) Any other route:

   Only prints information about the request.

Besides that the server serves the folder _built_ as a public folder. Any file within that folder will be served by the server. A file's url is as follows:

Let's say I have a file _built/custom-elements/sheets/index.html_. This file will be served when  _https:\//localhost:3000/custom-elements/sheets/index.html_ is requested.
