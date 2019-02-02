// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
import { delay } from './utils';

type Now<T> = () => T | undefined;

export type TypedDebouncedFunction<T> = {
  readonly now: Now<T>;
  readonly cancel: () => void;
  readonly isPending: () => boolean;
  (..._args: any[]): {
    readonly now: Now<T>;
  };
};

export type DebouncedFunction = TypedDebouncedFunction<void>;

export function debounce<T>(func: (...args: any[]) => T, wait: number): TypedDebouncedFunction<T> {
  let timeout;
  let args;
  let context;
  let later;

  // Has to be 'function' because of execution context.
  const res = function (...latestArgs): { readonly now: Now<T> } {
    context = this;
    args = latestArgs;
    later = (): T | undefined => {
      timeout = null;
      return func.apply(context, args);
    };

    if (timeout) {
      timeout.cancel();
      timeout = null;
    }

    timeout = delay(wait).then(later);

    return {
      now: (): T | undefined => {
        if (timeout) {
          timeout.cancel();
          timeout = null;
          return func.apply(context, args);
        }
        else {
          return undefined;
        }
      },
    };
  };

  return Object.assign(res, {
    now: (): T | undefined => {
      if (timeout) {
        timeout.cancel();
        timeout = null;
        return later();
      }
      return undefined;
    },
    cancel: (): void => {
      if (timeout) {
        timeout.cancel();
        timeout = null;
      }
    },
    isPending: (): boolean => {
      return !!timeout;
    },
  });
}
