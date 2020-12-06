using NetTopologySuite.Geometries;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// GeometryExtensions static class, provides extension methods for geometry objects.
    /// </summary>
    public static class GeometryExtensions
    {
        /// <summary>
        /// Convert an Envelope to a Polygon.
        /// </summary>
        /// <param name="envelope"></param>
        /// <returns></returns>
        public static Polygon ToPolygon(this Envelope envelope)
        {
            if (envelope != null && envelope.MinX <= envelope.MaxX && envelope.MinY <= envelope.MaxY)
            {
                var pfactory = new GeometryFactory();
                var bounds = new[]
                {
                    new Coordinate(envelope.MinX, envelope.MinY),
                    new Coordinate(envelope.MaxX, envelope.MinY),
                    new Coordinate(envelope.MaxX, envelope.MaxY),
                    new Coordinate(envelope.MinX, envelope.MaxY),
                    new Coordinate(envelope.MinX, envelope.MinY),
                };

                var poly = pfactory.CreatePolygon(new LinearRing(bounds));
                poly.SRID = 4326;
                return poly;
            }
            return null;
        }

        /// <summary>
        /// Convert an array of Coordinate to a Polygon.
        /// If the coordinate array is only a length of two it will be treated like a boundary.
        /// If the coordinate array does not self close, it will by default close with the inital coordinates.
        /// The coordinate array should be expressed counter-clockwise.
        /// </summary>
        /// <param name="coords"></param>
        /// <returns></returns>
        public static Polygon ToPolygon(this Coordinate[] coords)
        {
            if (coords != null && coords.Length > 1)
            {
                var pfactory = new GeometryFactory();
                Coordinate[] bounds;
                if (coords.Length == 2)
                {
                    bounds = new[]
                    {
                        new Coordinate(coords[0].X, coords[0].Y),
                        new Coordinate(coords[1].X, coords[0].Y),
                        new Coordinate(coords[1].X, coords[1].Y),
                        new Coordinate(coords[0].X, coords[1].Y),
                        new Coordinate(coords[0].X, coords[0].Y),
                    };
                }
                else if (!coords[0].Equals(coords[^1]))
                {
                    // Make sure the ring is closed.
                    bounds = new Coordinate[coords.Length + 1];
                    coords.CopyTo(bounds, 0);
                    bounds[coords.Length] = coords[0];
                }
                else
                {
                    bounds = coords;
                }

                var poly = pfactory.CreatePolygon(new LinearRing(bounds));
                poly.SRID = 4326;
                return poly;
            }
            return null;
        }
    }
}
