using NetTopologySuite.Geometries;

namespace Pims.Api.Areas.Property.Models.Search
{
    /// <summary>
    /// GeoJson class, provides a model to represent the property whether Land or Building.
    /// </summary>
    public class GeoJsonGeometryModel
    {
        #region Properties
        /// <summary>
        /// get/set - The type of geometry.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// get/set - The coordinates of the data structure.
        /// </summary>
        /// <value></value>
        public Geometry Coordinates { get; set; }
        #endregion
    }
}
