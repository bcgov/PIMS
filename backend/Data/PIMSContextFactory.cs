using System;
using System.Data.SqlClient;
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
            DotNetEnv.Env.Load();
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .AddJsonFile("connectionstrings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"connectionstrings.{environment}.json", optional: true, reloadOnChange: true)
                .AddUserSecrets<Startup>()
                .Build();

            var cs = config.GetConnectionString("PIMS");
            var builder = new SqlConnectionStringBuilder(cs);
            builder.Password = config["DB_PASSWORD"];

            var optionsBuilder = new DbContextOptionsBuilder<PIMSContext>();
            // optionsBuilder.UseNpgsql (cs, opts => opts.CommandTimeout ((int) TimeSpan.FromMinutes (10).TotalSeconds));
            optionsBuilder.UseSqlServer(builder.ConnectionString, opts => opts.CommandTimeout((int)TimeSpan.FromMinutes(10).TotalSeconds));
            return new PIMSContext(optionsBuilder.Options);
        }
    }
}
