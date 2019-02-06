import { Stats } from 'webpack';
import {
  prettyPrint,
  prettyString,
} from '../common/utils/prettyPrint';
import {
  CmdArguments,
  getArguments,
  reportArgConflicts,
} from './src/arguments';
import {
  buildOnce,
  setupFileWatcher,
} from './src/build/buildWebpack';
import { compilePugToHTML } from './src/build/compilePugToHTML';
import {
  CustomElementInformation,
  gatherCustomElementsInformation,
} from './src/build/customElementInfo';
import { ICompilationArgs } from './src/build/ICompilationArgs';
import { setupServer } from './src/serverSetup';
import { once } from '../common/utils/once';

const setupServerOnce = once(setupServer);

const logCompiledEntryPoint = (stats: Stats): void => {
  console.log('\n\nCompiled successfully: ');
  stats.compilation.entrypoints.forEach(entry => {
    const chunk = entry.runtimeChunk;
    console.log(`${chunk.name}: ${prettyString(chunk.files)}`);
  });
};

const logCompilationErrors = (stats: Stats): void => {
  console.log('\n\nCompilation failed:\n\n');
  console.log(stats.toJson({
    // errorDetails: true,
    errors: true,
  }));
};

const buildOnceAndOutput = async (customElementsInformation: ReadonlyArray<CustomElementInformation>) => {
  try {
    const info = await buildOnce(customElementsInformation);
    logCompiledEntryPoint(info);
  }
  catch (info) {
    logCompilationErrors(info);

    throw new Error('Could not compile typescript or styles.');
  }
};

const setupWatcher = async (customElementsInformation: ReadonlyArray<CustomElementInformation>, args: CmdArguments) => {
  setupFileWatcher(customElementsInformation, (error, stats) => {
      if (error || stats.hasErrors()) {
        logCompilationErrors(stats);
      }
      else {
        logCompiledEntryPoint(stats);
        if (args.server) {
          setupServerOnce(customElementsInformation, args);
        }
      }
    },
  );
};

const compileToHTML = async (customElementsInformation: ReadonlyArray<CustomElementInformation>, args: ICompilationArgs) => {
  await buildOnceAndOutput(customElementsInformation);
  try {
    const results = await compilePugToHTML(customElementsInformation, args);
    prettyPrint(results);
  }
  catch (hopefullySomeUsefulInfo) {
    prettyPrint(hopefullySomeUsefulInfo);
  }
};


async function main() {
  const args = getArguments(process.argv);
  reportArgConflicts(args);

  const customElementsInformation = gatherCustomElementsInformation();

  if (args.watch) {
    setupWatcher(customElementsInformation, args);
  }
  else {
    if (args.compile) {
      await compileToHTML(customElementsInformation, args);
    }
    else if (args.buildOnce) {
      await buildOnceAndOutput(customElementsInformation);
    }
    setupServerOnce(customElementsInformation, args);
  }
}

main();
