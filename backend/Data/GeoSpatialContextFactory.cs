using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace BackendApi.Data
{
    public class GeoSpatialContextFactory : IDesignTimeDbContextFactory<GeoSpatialContext>
    {
        public GeoSpatialContext CreateDbContext (string[] args)
        {
            var config = new ConfigurationBuilder ()
                .SetBasePath (Directory.GetCurrentDirectory ())
                .AddEnvironmentVariables ()
                .Build ();

            var cs = config.GetConnectionString ("GeoSpatial");
            var optionsBuilder = new DbContextOptionsBuilder<GeoSpatialContext> ();
            optionsBuilder.UseNpgsql (cs, opts => opts.CommandTimeout ((int) TimeSpan.FromMinutes (10).TotalSeconds));
            return new GeoSpatialContext (optionsBuilder.Options);
        }
    }
}
