import { Stats } from 'webpack';
import { prettyString } from '../common/utils/prettyPrint';
import { getArguments } from './src/arguments';
import {
  buildOnce,
  setupFileWatcher,
} from './src/build/buildWebpack';
import {
  ICompilationArgs,
  setupServer,
} from './src/serverSetup';
import { once } from '../common/utils/once';

const logCompiledEntryPoint = (stats: Stats): void => {
  console.log('\n\nCompiled successfully: ');
  stats.compilation.entrypoints.forEach(entry => {
    const chunk = entry.runtimeChunk;
    console.log(`${chunk.name}: ${prettyString(chunk.files)}`);
  });
};

const logCompilationErrors = (stats: Stats): void => {
  console.log('\n\nCompilation failed:\n\n');
  console.log(stats.compilation.errors);
};

async function buildOnceAndOutput() {
  try {
    const info = await buildOnce();
    logCompiledEntryPoint(info);
  }
  catch (info) {
    logCompilationErrors(info);

    throw new Error('Could not compile.');
  }
}

function setupWatcher(args: ICompilationArgs) {
  const setupServerOnce = once(setupServer);
  setupFileWatcher((error, stats) => {
      if (error || stats.hasErrors()) {
        logCompilationErrors(stats);
      }
      else {
        logCompiledEntryPoint(stats);
        setupServerOnce(args);
      }
    },
  );
}

async function main() {
  const args = getArguments(process.argv);
  if (args.watch) {
    setupWatcher(args);
  }
  else {
    await buildOnceAndOutput();
    setupServer(args);
  }
}

main();
