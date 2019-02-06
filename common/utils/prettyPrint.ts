export const prettyPrint = <T extends object>(arg: T): void => {
  console.log(prettyString(arg));
};

export const prettyString = <T extends object>(arg: T): string => {
  return JSON.stringify(arg, null, 2);
};
