import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import {
  getBuiltCssPath,
  getBuiltCssSrc,
  getBuiltJsSrc,
} from './build/buildWebpack';

export interface ICompilationArgs {
  readonly inlineJs: boolean;
  readonly inlineStyles: boolean;
}

export const setupServer = (_compilationArgs: ICompilationArgs): void => {
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

    const stylesheetPath = getBuiltCssPath(elementName);
    const viewDir = path.join(__dirname, '../client/custom-elements', elementName);
    const viewPath = path.join(viewDir, 'index');

    if (!fs.existsSync(`${viewPath}.pug`)) {
      res.send(JSON.stringify({
        problem: 'The referred custom element does not exist.',
        path: req.path,
        pathOfTheViewNotFound: `${viewPath}.pug`,
      }, null, 4));
    }
    else {
      const stylesheet = fs.readFileSync(stylesheetPath);
      console.log(viewPath);
      res.render(viewPath, {
        stylesheet,
        stylesheetSrc: getBuiltCssSrc(elementName),
        scriptSrc: getBuiltJsSrc(elementName),
      });
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
    .listen(3000, function () {
      console.log('Example app listening on port 3000! Go to https://localhost:3000/');
    });
};
