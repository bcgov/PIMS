const EPSILON = 1e-10; // A small tolerance for floating-point comparison

/**
 * Helper function to calculate the 2D cross product of two vectors.
 * @param x1 - X component of vector 1
 * @param y1 - Y component of vector 1
 * @param x2 - X component of vector 2
 * @param y2 - Y component of vector 2
 * @returns The cross product (a scalar value).
 */
const crossProduct = (x1: number, y1: number, x2: number, y2: number): number => {
  return x1 * y2 - y1 * x2;
};

/**
 * Helper function to calculate the dot product of two vectors.
 * @param x1 - X component of vector 1
 * @param y1 - Y component of vector 1
 * @param x2 - X component of vector 2
 * @param y2 - Y component of vector 2
 * @returns The dot product (a scalar value).
 */
const dotProduct = (x1: number, y1: number, x2: number, y2: number): number => {
  return x1 * x2 + y1 * y2;
};

/**
 * Helper function to calculate the angle between two vectors.
 * @param p - The point being checked.
 * @param v1 - First vertex of the polygon edge.
 * @param v2 - Second vertex of the polygon edge.
 * @returns The angle between the vectors formed by the point and the two vertices.
 */
const angleBetweenVectors = (
  p: { x: number; y: number },
  v1: { x: number; y: number },
  v2: { x: number; y: number },
): number => {
  // Get the difference between the point and vectors towards the two points
  const x1 = v1.x - p.x,
    y1 = v1.y - p.y;
  const x2 = v2.x - p.x,
    y2 = v2.y - p.y;

  const cross = crossProduct(x1, y1, x2, y2); // Gives rotation (clockwise, counterclockwise) and sign of angle
  const dot = dotProduct(x1, y1, x2, y2); // Gives magnitude and cosine of angle

  // atan2 gives the signed angle between two vectors in radians
  // https://en.wikipedia.org/wiki/Atan2
  return Math.atan2(cross, dot);
};

/**
 * Checks if a point is inside a polygon using the Winding Number Algorithm.
 * @param point The point to check.
 * @param polygon The polygon defined as an array of points.
 * @returns True if the point is inside the polygon, false otherwise.
 */
export const isPointInPolygon = (
  point: { x: number; y: number },
  polygonPoints: { x: number; y: number }[],
): boolean => {
  let windingNumber = 0;

  // Travel around the polygon, taking pairs of points
  for (let i = 0; i < polygonPoints.length; i++) {
    const v1 = polygonPoints[i];
    const v2 = polygonPoints[(i + 1) % polygonPoints.length];

    // Compute the angle between vectors (point -> v1) and (point -> v2)
    const angle = angleBetweenVectors(point, v1, v2);
    windingNumber += angle;
  }

  // If the total winding number is not zero, the point is inside
  return Math.abs(windingNumber) > EPSILON; // Use tolerance for floating-point errors
};

/**
 * Checks if a point is inside any of the polygons in a multipolygon.
 * @param point The point to check.
 * @param multiPolygon The multipolygon, an array of polygons.
 * @returns True if the point is inside any polygon, false otherwise.
 */
export const isPointInMultiPolygon = (
  point: { x: number; y: number },
  multiPolygon: { x: number; y: number }[][],
): boolean => {
  for (const polygon of multiPolygon) {
    if (isPointInPolygon(point, polygon)) {
      return true;
    }
  }
  return false;
};
