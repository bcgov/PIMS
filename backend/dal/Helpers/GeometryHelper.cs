using System;

namespace Pims.Dal.Helpers
{
    /// <summary>
    /// GeometryHelper static class, provides methods to help with goemetric shapes.
    /// </summary>
    public static class GeometryHelper
    {
        /// <summary>
        /// Create a goemetric point object for the specified 'longitude' and 'latitude'.
        /// </summary>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        /// <returns></returns>
        public static NetTopologySuite.Geometries.Point CreatePoint(double longitude, double latitude)
        {
            /// Spatial Reference Identifier (SRID) is a unique identifier associated with a specific coordinate system, tolerance, and resolution (default 4326).
            return new NetTopologySuite.Geometries.Point(longitude, latitude) { SRID = 4326 };
        }
    }
}
