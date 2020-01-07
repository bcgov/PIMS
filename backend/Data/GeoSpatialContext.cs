using BackendApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data
{
    /// <summary>
    /// GeoSpatialContext class, provides a data context to manage the datasource for the Geo-spatial application.
    /// </summary>
    public class GeoSpatialContext : DbContext
    {
        #region Properties
        public DbSet<Place> Places { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a GeoSpatialContext class.
        /// </summary>
        /// <returns></returns>
        public GeoSpatialContext ()
        {

        }

        /// <summary>
        /// Creates a new instance of a GeoSpatialContext class.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public GeoSpatialContext (DbContextOptions<GeoSpatialContext> options) : base (options)
        {

        }
        #endregion
    }
}
