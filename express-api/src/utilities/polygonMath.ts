/**
 * Checks if a point is inside a polygon using the Ray-Casting algorithm.
 * @param point The point to check.
 * @param polygonPoints The polygon defined as an array of points.
 * @returns True if the point is inside the polygon, false otherwise.
 */
export const isPointInPolygon = (
  point: { x: number; y: number },
  polygonPoints: { x: number; y: number }[],
): boolean => {
  let isInside = false;
  const { x, y } = point;
  const n = polygonPoints.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygonPoints[i].x,
      yi = polygonPoints[i].y;
    const xj = polygonPoints[j].x,
      yj = polygonPoints[j].y;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) isInside = !isInside;
  }

  return isInside;
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
