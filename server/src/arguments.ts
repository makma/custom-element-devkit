import commander from 'commander';

export type CmdArguments = {
  readonly buildOnce: boolean;
  readonly compile: boolean;
  readonly inlineJs: boolean;
  readonly inlineStyles: boolean;
  readonly minify: boolean;
  readonly port: number;
  readonly server: boolean;
  readonly watch: boolean;
};

const argParser = commander
  .usage('npm start -- [options]')
  .option('-b, --build-once', 'Compile all custom elements scripts and styles.', false)
  .option('-c, --compile', 'Compile all custom elements into one HTML file to be then served as a static file.', false)
  .option('-h, --server', 'Start the https server.', false)
  .option('-j, --inline-js', 'Indicate whether you want to inline JS into the served HTML.', false)
  .option('-m, --minify', 'Will minify styles and script.', false)
  .option('-p, --port <n>', 'Set a custom port to run the server on. (Default: 3000)', parseInt)
  .option('-s, --inline-styles', 'Indicate whether you want to inline styles in the served HTML.', false)
  .option('-w, --watch', 'Indicate whether you want to recompile after client files change.', false)
;

export const getArguments = (argv: Array<string>): CmdArguments => {
  let args = argParser.parse(argv).opts();
  if (!args.port) {
    args = {
      ...args,
      port: 3000,
    };
  }
  return args as any as CmdArguments;
};

export const reportArgConflicts = (args: CmdArguments): void => {
  if (args.compile && args.watch) {
    console.warn(`The option '-c, --compile' will have no effect in presence of option '-w, --watch'.`);
  }
  if (args.buildOnce && args.compile) {
    console.warn(`The option '-b, --build-once' will have no effect in presence of option '-c, --compile'.`);
  }
  if (args.buildOnce && args.watch) {
    console.warn(`The option '-b, --build-once' will have no effect in presence of option '-w, --watch'.`);
  }
  if (args.minify && !(args.buildOnce || args.watch || args.compile)) {
    console.warn(`The option '-m, --minify' will have no effect in absence of option '-w, --watch' or '-b, --build-once' or '-c, --compile'.`);
  }
  if (argParser.port && !args.server) {
    console.warn(`The option '-p, --port' will have no effect in absence of option '-h, --server'.`);
  }

  const hasAnyOptionBeenSpecified = Object.keys(argParser.opts()).reduce((anOptionSpecified, optionName) => anOptionSpecified || argParser[optionName], false);

  if (!hasAnyOptionBeenSpecified) {
    argParser.outputHelp();
  }
};
