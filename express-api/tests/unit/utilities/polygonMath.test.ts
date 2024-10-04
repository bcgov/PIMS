import { isPointInPolygon } from '@/utilities/polygonMath';

describe('isPointInPolygon', () => {
  const polygon = [
    { x: -124.12628173828126, y: 48.721773219750666 },
    { x: -123.89007568359376, y: 48.84664340683584 },
    { x: -124.13177490234376, y: 48.93152205931365 },
    { x: -124.26361083984376, y: 48.828565527993234 },
  ];
  it('should return true if the point is outside the polygon', () => {
    const point = {
      x: -124.0548,
      y: 48.8206,
    };
    expect(isPointInPolygon(point, polygon)).toEqual(true);
  });
  it('should return false if the point is outside the polygon', () => {
    const point = { x: -125.135, y: 48.8274 };
    expect(isPointInPolygon(point, polygon)).toEqual(false);
  });
});
