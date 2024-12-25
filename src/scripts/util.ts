const EPSILON = 0.01;

/**
 * Checks that the cover image for my project covers have an aspect ratio of 16:10, for no real
 * reason other than consistency and aesthetics
 */
function validProjectCover(width: number, height: number): boolean {
  const ratio = width / height;

  if (Math.abs(ratio - 1.6) <= EPSILON) {
    return true;
  }

  return false;
}

export { validProjectCover };
