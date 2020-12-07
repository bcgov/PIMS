namespace Pims.Api.Areas.Property.Models.Search
{
    /// <summary>
    /// GeoJson class, provides a model to represent the property whether Land or Building.
    /// </summary>
    public class GeoJson<T> where T : class
    {
        #region Properties
        /// <summary>
        /// get/set - The type of GeoJSON data structure.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// get/set - The goemetry of the data structure.
        /// </summary>
        public GeoJsonGeometryModel Geometry { get; set; }

        /// <summary>
        /// get/set - The properties of the data structure.
        /// </summary>
        public T Properties { get; set; }
        #endregion
    }
}
