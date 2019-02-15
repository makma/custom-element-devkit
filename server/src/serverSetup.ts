import express from 'express';
import fs from 'fs';
import https from 'https';
import * as path from 'path';
import { prettyPrint } from '../../common/utils/prettyPrint';
import { CmdArguments } from './arguments';
import { getRenderArgs } from './build/compilePugToHTML';
import { CustomElementInformation } from './build/customElementInfo';
import { getFailedRequestInfo } from './getFailedRequestInfo';


export const setupServer = (customElementsInformation: ReadonlyArray<CustomElementInformation>, args: CmdArguments): void => {
  if (!args.server) {
    return;
  }

  const app = express();

  app.set('view engine', 'pug');
  app.set('views', 'views');

  app.get('*', (req, res, next) => {
    if (req.path.indexOf('custom-elements') < 0) {
      res.append('X-Frame-Options', 'DENY');
    }
    next();
  });

  app.get('/custom-elements/:elementName', (req, res, next) => {
    const { params: { elementName }, headers: { referer } } = req;

    const mockCustomElementApi = (referer || '').indexOf('inventory') < 0;

    const elementInfo = customElementsInformation.find(element => element.name === elementName);
    if (elementInfo && fs.existsSync(elementInfo.viewFilePath)) {
      res.render(elementInfo.viewPath, getRenderArgs(elementInfo, args, mockCustomElementApi));
    }
    else {
      next();
    }
  });

  app.use(express.static('built'));

  app.all('*', (req, res) => {
    const reqInfo = getFailedRequestInfo(req);
    prettyPrint(reqInfo);
    res.statusCode = 404;
    res.render(path.join(__dirname, '../views/request-info'), reqInfo);
  });

  https.createServer({
    key: fs.readFileSync('server/credentials/server.key'),
    cert: fs.readFileSync('server/credentials/server.cert'),
  }, app)
    .listen(args.port, function () {
      console.log(`Example app listening on port ${args.port}! Go to https://localhost:${args.port}/`);
    });
};
