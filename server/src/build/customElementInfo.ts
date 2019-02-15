import fs from 'fs';
import path from 'path';
import {
  CustomElementsFolderName,
  HTMLFileName,
  OutputFilePath,
  ScriptBundleFileName,
  StylesheetBundleFileName,
} from './constants';

const getBuiltCssPath = (elementName: string) =>
  path.join(OutputFilePath, CustomElementsFolderName, elementName, StylesheetBundleFileName);

const getBuiltJsPath = (elementName: string) =>
  path.join(OutputFilePath, CustomElementsFolderName, elementName, ScriptBundleFileName);

const getBuiltHTMLPath = (elementName: string) =>
  path.join(OutputFilePath, CustomElementsFolderName, elementName, HTMLFileName);

const getBuiltCssSrc = (elementName: string) =>
  `/${path.join(CustomElementsFolderName, elementName, StylesheetBundleFileName)
    .replace('\\', '/')}`;

const getBuiltJsSrc = (elementName: string) =>
  `/${path.join(CustomElementsFolderName, elementName, ScriptBundleFileName)
    .replace('\\', '/')}`;

const PathToCustomElements = path.join(__dirname, '../../../client', CustomElementsFolderName);

export type CustomElementInformation = {
  readonly directoryPath: string;
  readonly entryPoints: ReadonlyArray<string>;
  readonly htmlFilePath: string;
  readonly initialValuePath: string;
  readonly name: string;
  readonly configPath: string;
  readonly scriptFilePath: string;
  readonly scriptSrc: string;
  readonly stylesheetFilePath: string;
  readonly stylesheetSrc: string;
  readonly viewFilePath: string;
  readonly viewPath: string;
};

export const gatherCustomElementsInformation = (): ReadonlyArray<CustomElementInformation> => {
  const customElementsDir = fs.readdirSync(PathToCustomElements);
  const customElementNames = customElementsDir.filter(
    item => fs.lstatSync(path.join(PathToCustomElements, item)).isDirectory(),
  );

  return customElementNames.map(name => {
    const elementDirFullPath = path.join(PathToCustomElements, name);
    const elementFiles = fs.readdirSync(elementDirFullPath);
    const entryFiles = elementFiles
      .filter(filename => /\.(j|t)sx?/.test(filename))
      .map(filename => path.join(elementDirFullPath, filename));

    if (entryFiles.length <= 0) {
      throw new Error(`There's no entry point for element '${name}'. Add a javascript or typescript file.`);
    }

    const directoryPath = path.join(PathToCustomElements, name);

    return {
      directoryPath,
      entryPoints: entryFiles,
      name,
      viewFilePath: path.join(directoryPath, 'index.pug'),
      configPath: path.join(directoryPath, 'config.json'),
      initialValuePath: path.join(directoryPath, 'initialValue.json'),
      viewPath: path.join(directoryPath, 'index'),
      scriptFilePath: getBuiltJsPath(name),
      scriptSrc: getBuiltJsSrc(name),
      stylesheetFilePath: getBuiltCssPath(name),
      stylesheetSrc: getBuiltCssSrc(name),
      htmlFilePath: getBuiltHTMLPath(name),
    };
  });
};
