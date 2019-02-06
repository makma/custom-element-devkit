import fs from 'fs';
import pug from 'pug';
import { CustomElementInformation } from './customElementInfo';
import { ICompilationArgs } from './ICompilationArgs';
import { IPugTemplateRenderArgs } from './IPugTemplateRenderArgs';


export const getRenderArgs = (elementInfo: CustomElementInformation, buildArgs: ICompilationArgs): IPugTemplateRenderArgs => {
  const renderArgs: IPugTemplateRenderArgs = {};
  if (buildArgs.inlineJs) {
    const script = fs.readFileSync(elementInfo.scriptFilePath).toString();
    renderArgs.inlineScript = script;
  }
  else {
    renderArgs.scriptSrc = elementInfo.scriptSrc;
  }
  if (buildArgs.inlineStyles) {
    const stylesheet = fs.readFileSync(elementInfo.stylesheetFilePath).toString();
    renderArgs.inlineStylesheet = stylesheet;
  }
  else {
    renderArgs.stylesheetSrc = elementInfo.stylesheetSrc;
  }

  return renderArgs;
};

export const compilePugToHTML = async (customElementsInformation: ReadonlyArray<CustomElementInformation>, buildArgs: ICompilationArgs) => {
  return customElementsInformation.reduce((compilationResults, elementInfo) => {
    try {
      const renderHTML = pug.compileFile(elementInfo.viewFilePath);
      const html = renderHTML(getRenderArgs(elementInfo, buildArgs));
      fs.writeFileSync(elementInfo.htmlFilePath, Buffer.from(html));
      compilationResults[elementInfo.name] = 'Success';
    }
    catch (e) {
      compilationResults[elementInfo.name] = {
        result: 'Failure!',
        error: e,
      };
    }
    return compilationResults;
  }, {});
};
