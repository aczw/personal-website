/**
 * I've disabled trailing slashes in both the Astro and Vercel configs, but
 * this makes sure that any URLs we use do not contain a trailing slash. Important
 * for things like canonical URLs.
 *
 * @see https://github.com/withastro/astro/issues/5248
 */
const removeTrailingSlash = (str: string) => {
  return str.replace(/\/+$/, "");
};

export { removeTrailingSlash };
