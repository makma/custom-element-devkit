const doNothing = () => { /* do nothing*/
};

export type CancelablePromise = {
  then: (success?: () => any, _fail?: (reason) => any) => any,
  cancel: () => void,
};

export class CancelledDelay {
}

function cancelable(thePromise: any, timeout: number, rejectCallback: (reason) => any): CancelablePromise {
  const originalThen = thePromise.then;

  return Object.assign(thePromise, {
    cancel() {
      clearTimeout(timeout);
      rejectCallback(new CancelledDelay());
    },
    then(success, fail) {
      return cancelable(originalThen.call(thePromise, success, fail), timeout, rejectCallback);
    },
  });
}

export function delay(duration: number): CancelablePromise {
  let timeout: any = -1;
  let rejectCallback = doNothing;
  const thePromise = new Promise((resolve, reject) => {
    rejectCallback = reject;
    // We can't use window.setTimeout here, because that doesn't work in tests
    timeout = setTimeout(resolve, duration);
  });

  return cancelable(thePromise, timeout, rejectCallback);
}

export const tryParseJSON = <T>(json: string, defaultValue: T): T => {
  try {
    return JSON.parse(json);
  }
  catch {
    return defaultValue;
  }
};
