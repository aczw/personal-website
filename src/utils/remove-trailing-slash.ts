const removeTrailingSlash = (str: string) => {
  return str.replace(/\/+$/, "");
};

export { removeTrailingSlash };
