using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Pims.Api.Data
{
    public class PIMSContextFactory : IDesignTimeDbContextFactory<PIMSContext>
    {
        public PIMSContext CreateDbContext(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
                .AddUserSecrets<PIMSContextFactory>()
                .AddEnvironmentVariables()
                .Build();

            var cs = config.GetConnectionString("PIMS");
            var optionsBuilder = new DbContextOptionsBuilder<PIMSContext>();
            // optionsBuilder.UseNpgsql (cs, opts => opts.CommandTimeout ((int) TimeSpan.FromMinutes (10).TotalSeconds));
            optionsBuilder.UseSqlServer(cs, opts => opts.CommandTimeout((int)TimeSpan.FromMinutes(10).TotalSeconds));
            return new PIMSContext(optionsBuilder.Options);
        }
    }
}
