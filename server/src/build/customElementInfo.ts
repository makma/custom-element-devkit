import fs from 'fs';
import path from 'path';
import {
  HTMLFileName,
  OutputFilePath,
  ScriptBundleFileName,
  StylesheetBundleFileName,
} from './constants';

const getBuiltCssPath = (elementName: string) =>
  path.join(OutputFilePath, elementName, StylesheetBundleFileName);

const getBuiltJsPath = (elementName: string) =>
  path.join(OutputFilePath, elementName, ScriptBundleFileName);

const getBuiltHTMLPath = (elementName: string) =>
  path.join(OutputFilePath, elementName, HTMLFileName);

const getBuiltCssSrc = (elementName: string) =>
  `/${path.join('custom-elements', elementName, StylesheetBundleFileName)
    .replace('\\', '/')}`;

const getBuiltJsSrc = (elementName: string) =>
  `/${path.join('custom-elements', elementName, ScriptBundleFileName)
    .replace('\\', '/')}`;

const PathToCustomElements = path.join(__dirname, '../../../client/custom-elements');

export type CustomElementInformation = {
  readonly directoryPath: string;
  readonly entryPoints: ReadonlyArray<string>;
  readonly name: string;
  readonly htmlFilePath: string;
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
    const tsFiles = elementFiles
      .filter(filename => filename.endsWith('.ts') || filename.endsWith('.tsx'))
      .map(filename => path.join(elementDirFullPath, filename));
    const directoryPath = path.join(PathToCustomElements, name);

    return {
      directoryPath,
      entryPoints: tsFiles,
      name,
      viewFilePath: path.join(directoryPath, 'index.pug'),
      viewPath: path.join(directoryPath, 'index'),
      scriptFilePath: getBuiltJsPath(name),
      scriptSrc: getBuiltJsSrc(name),
      stylesheetFilePath: getBuiltCssPath(name),
      stylesheetSrc: getBuiltCssSrc(name),
      htmlFilePath: getBuiltHTMLPath(name),
    };
  });
};
