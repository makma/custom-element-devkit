import { Request } from 'express';
import path from 'path';

const getPotentialProblem = (req: Request): string => {
  if (req.method !== 'GET') {
    return 'Use the GET method. All other methods are ignored.';
  }
  if (req.path.indexOf('custom-elements') >= 0 && req.path.indexOf('index.html') >= 0) {
    return `It looks like you're requesting a compiled custom element's HTML. The file is likely not there. It should be in <pre>${path.join('&lt;repo&gt;', 'built', req.path)}</pre>.<br />
        Don't forget, that any compilation flag clears the <pre>built</pre> folder.`;
  }
  if (req.path.indexOf('index.html') >= 0) {
    return `It looks like you're requesting a compiled custom element's HTML. But the path does not match a custom element's path.`;
  }
  if (new RegExp('/custom-elements/\\w+$').test(req.path)) {
    return `It looks like there's trouble finding this element. You have likely made a typo in the element name or there's no view (index.pug) in the element's folder.`;
  }
  if (new RegExp('/custom-elements/\\w+/.+$').test(req.path)) {
    return `It looks like you're requesting a file from the static folder (built). The file is likely not there. It should be in <pre>${path.join('&lt;repo&gt;', 'built', req.path)}</pre>.<br />
        Don't forget, that any compilation flag clears the <pre>built</pre> folder.`;
  }

  return 'This not an anticipated error.';
};

type RequestInfo = {
  readonly path: string;
  readonly method: string;
  readonly possibleProblem: string;
};

export const getFailedRequestInfo = (request: Request): RequestInfo => {
  return {
    path: request.path,
    method: request.method,
    possibleProblem: getPotentialProblem(request),
  };
};
