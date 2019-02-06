import commander from 'commander';

type Arguments = {
  readonly watch: boolean;
  readonly inlineJs: boolean;
  readonly inlineStyles: boolean;
  readonly compile: boolean;
};

const argParser = commander
  .option('-w, --watch', 'Indicate whether you want to recompile after client files change.', false)
  .option('-j, --inline-js', 'Indicate whether you want to inline JS into the served HTML.', false)
  .option('-s, --inline-styles', 'Indicate whether you want to inline styles in the served HTML.', false)
  .option('-c, --compile', 'Compile all custom modules into one HTML file to be then served as a static file.', false);

export const getArguments = (argv: Array<string>): Arguments => {
  const args = argParser.parse(argv);
  return args as any as Arguments;
};
