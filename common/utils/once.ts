type Executor<T extends any[], R> = (...args: T) => R;

export const once = function <T extends any[], R>(executor: Executor<T, R>): Executor<T, R> {
  let ran = false;
  let memo: R;
  return function () {
    if (!ran) {
      ran = true;
      memo = executor.apply(this, arguments as any as T);
    }
    return memo;
  };
};
