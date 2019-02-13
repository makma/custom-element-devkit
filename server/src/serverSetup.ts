import express from 'express';
import fs from 'fs';
import https from 'https';
import { prettyString } from '../../common/utils/prettyPrint';
import { CmdArguments } from './arguments';
import { getRenderArgs } from './build/compilePugToHTML';
import { CustomElementInformation } from './build/customElementInfo';


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

  app.get('/', (_req, res) => {
    res.send('hello world');
  });

  app.get('/custom-elements/:elementName', (req, res) => {
    const { elementName } = req.params;

    const elementInfo = customElementsInformation.find(element => element.name === elementName);
    if (elementInfo) {
      if (!fs.existsSync(elementInfo.viewFilePath)) {
        res.send(prettyString({
          problem: `The referred custom element's view does not exist.`,
          elementName,
          path: req.path,
          pathOfTheViewNotFound: elementInfo.viewFilePath,
        }));
      }
      else {
        console.log(elementInfo.viewPath);

        res.render(elementInfo.viewPath, getRenderArgs(elementInfo, args));
      }
    }
  });

  app.use(express.static('built'));

  app.get('*', (_req, res) => {
    res.send(`I have no idea, what you're trying to do.`);
  });

  https.createServer({
    key: fs.readFileSync('server/credentials/server.key'),
    cert: fs.readFileSync('server/credentials/server.cert'),
  }, app)
    .listen(args.port, function () {
      console.log(`Example app listening on port ${args.port}! Go to https://localhost:${args.port}/`);
    });
};
