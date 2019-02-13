import fs from 'fs';
import webpack, {
  Entry,
  Output,
  Stats,
} from 'webpack';
import {
  OutputFilePath,
  ScriptBundleFileName,
} from './constants';
import {
  CustomElementInformation,
} from './customElementInfo';
import { getWebpackConfig } from './getWebpackConfig';
import Handler = webpack.MultiCompiler.Handler;

export type BuildOptions = {
  minify: boolean;
};

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

function getEntries(customElementsInformation: ReadonlyArray<CustomElementInformation>): Entry {
  const webpackEntries = customElementsInformation.reduce((entries, elementInfo) => {
    return {
      ...entries,
      [elementInfo.name]: elementInfo.entryPoints,
    };
  }, {});

  return webpackEntries;
}

function getOutput(): Output {
  const webpackOutput: Output = {
    path: OutputFilePath,
    filename: `[name]/${ScriptBundleFileName}`,
  };

  return webpackOutput;
}

export async function buildOnce(customElementsInformation: ReadonlyArray<CustomElementInformation>, options: BuildOptions): Promise<Stats> {
  deleteFolder('./built');
  const webpackConfiguration = getWebpackConfig(getEntries(customElementsInformation), getOutput(), options.minify);

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


export function setupFileWatcher(customElementsInformation: ReadonlyArray<CustomElementInformation>, handler: Handler, options: BuildOptions): void {
  deleteFolder('./built');
  const webpackConfiguration = getWebpackConfig(getEntries(customElementsInformation), getOutput(), options.minify);

  console.log(`Webpack configuration:`);
  console.log(JSON.stringify(webpackConfiguration, filterProps, 2));
  const compiler = webpack(webpackConfiguration);

  console.log('Watching!!!');
  compiler.watch({}, handler);
}
