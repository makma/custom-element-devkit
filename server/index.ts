import { Stats } from 'webpack';
import { buildOnce, setupFileWatcher } from '../build/buildWebpack';
import { setupServer } from './serverSetup';
import { once } from '../common/utils/once';

const logCompiledEntryPoint = (stats: Stats): void => {
  console.log('\n\nCompiled successfully: ');
  stats.compilation.entrypoints.forEach(entry => {
    const chunk = entry.runtimeChunk;
    console.log(`${chunk.name}: ${JSON.stringify(chunk.files, null, 2)}`);
  });
};

const logCompilationErrors = (stats: Stats): void => {
  console.log('\n\nCompilation failed:\n\n');
  console.log(stats.compilation.errors);
};

async function compileAndOutput() {
  try {
    const info = await buildOnce();
    logCompiledEntryPoint(info);
  } catch (info) {
    logCompilationErrors(info);

    throw new Error('Could not compile.');
  }
}

function setupWatcher() {
  const setupServerOnce = once(setupServer);
  setupFileWatcher((error, stats) => {
      if (error || stats.hasErrors()) {
        logCompilationErrors(stats);
      }
      else {
        logCompiledEntryPoint(stats);
        setupServerOnce();
      }
    }
  );
}

async function main() {
  if (process.argv.includes('-w')) {
    setupWatcher();
  }
  else {
    await compileAndOutput();
    setupServer();
  }
}

main();
