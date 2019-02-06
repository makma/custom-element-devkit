import fs from 'fs';
import webpack, {
  Entry,
  Output,
  Stats,
} from 'webpack';
import { webpackConfig } from './webpack.config';
import path from 'path';
import Handler = webpack.MultiCompiler.Handler;

const StylesheetBundleFileName = 'bundle.css';
const ScriptBundleFileName = 'bundle.js';
const PathToCustomElements = path.join(__dirname, '../client/custom-elements');
const OutputFilePath = path.join(PathToCustomElements, '../../built/custom-elements');


function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = folderPath + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      }
      else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

function filterProps(key, value) {
  if (key === 'plugins' && Array.isArray(value)) {
    return value.reduce((pluginArray, plugin) => pluginArray.concat([plugin && plugin.constructor && plugin.constructor.name || plugin.name]), []);
  }

  return value;
}

function getEntries(): Entry {
  const customElementsDir = fs.readdirSync(PathToCustomElements);
  const webpackEntries = customElementsDir.reduce((entries, elementName) => {
    const elementDirFullPath = path.join(PathToCustomElements, elementName);
    if (fs.lstatSync(elementDirFullPath).isDirectory()) {
      const elementFiles = fs.readdirSync(elementDirFullPath);
      const tsFiles = elementFiles
        .filter(filename => filename.endsWith('.ts') || filename.endsWith('.tsx'))
        .map(filename => path.join(elementDirFullPath, filename));
      return {
        ...entries,
        [elementName]: tsFiles,
      };
    }
    return entries;
  }, {});

  return webpackEntries;
}

export function getBuiltCssPath(elementName: string) {
  return path.join(OutputFilePath, elementName, StylesheetBundleFileName);
}

export function getBuiltCssSrc(_elementName: string) {
  return path.join(StylesheetBundleFileName)
    .replace('\\', '/');
}

export function getBuiltJsSrc(_elementName: string) {
  return path.join(ScriptBundleFileName)
    .replace('\\', '/');
}

function getOutput(): Output {
  const webpackOutput: Output = {
    path: OutputFilePath,
    filename: `[name]/${ScriptBundleFileName}`,
  };

  return webpackOutput;
}

export async function buildOnce(): Promise<Stats> {
  deleteFolder('./built');
  const webpackConfiguration = Object.assign({}, webpackConfig, {
    entry: getEntries(),
    output: getOutput(),
  });

  console.log(`Webpack configuration:`);
  console.log(JSON.stringify(webpackConfiguration, filterProps, 2));
  const compiler = webpack(webpackConfiguration);
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error || stats.hasErrors()) {
        reject(stats);
      }
      else {
        resolve(stats);
      }
    });
  });
}


export function setupFileWatcher(handler: Handler): void {
  deleteFolder('./built');
  const webpackConfiguration = Object.assign({}, webpackConfig, {
    entry: getEntries(),
    output: getOutput(),
  });

  console.log(`Webpack configuration:`);
  console.log(JSON.stringify(webpackConfiguration, filterProps, 2));
  const compiler = webpack(webpackConfiguration);

  console.log('Watching!!!');
  compiler.watch({}, handler);
}
