using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using System;
using System.Data.SqlClient;
using System.IO;

namespace Pims.Dal
{
    /// <summary>
    /// PimsContextFactory class, provides a way to use the design time tools (i.e. dotnet ef database update).
    /// </summary>
    public class PimsContextFactory : IDesignTimeDbContextFactory<PimsContext>
    {
        #region Variables
        private readonly ILogger<PimsContextFactory> _logger;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PimsContextFactory class.
        /// </summary>
        public PimsContextFactory()
        {
            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder
                    .AddFilter("Microsoft", LogLevel.Warning)
                    .AddFilter("System", LogLevel.Warning)
                    .AddFilter("Pims.Api", LogLevel.Debug)
                    .AddConsole();
                // .AddEventLog();
            });
            _logger = loggerFactory.CreateLogger<PimsContextFactory>();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Create the database context so that the design time tools can connect to it.
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public PimsContext CreateDbContext(string[] args)
        {
            DotNetEnv.Env.Load();
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

            // As per Microsoft documentation, a typical sequence of configuration providers is:
            //   1. appsettings.json
            //   2. appsettings.{Environment}.json
            //   3. Secret Manager (if in development)
            //   4. Environment variables using the Environment Variables configuration provider.
            //   5. Command - line arguments using the Command-line configuration provider.
            // source: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-3.1#configuration-providers
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("connectionstrings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"connectionstrings.{environment}.json", optional: true, reloadOnChange: true);

            if (!environment.IsProduction())
            {
                builder.AddUserSecrets<PimsContext>();
            }

            builder.AddEnvironmentVariables();

            var config = builder.Build();

            var cs = config.GetConnectionString("PIMS");
            var sqlBuilder = new SqlConnectionStringBuilder(cs)
            {
                Password = config["DB_PASSWORD"]
            };

            var optionsBuilder = new DbContextOptionsBuilder<PimsContext>();
            optionsBuilder.UseSqlServer(sqlBuilder.ConnectionString, options =>
            {
                options.CommandTimeout((int)TimeSpan.FromMinutes(10).TotalSeconds);
                options.UseNetTopologySuite();
            });
            return new PimsContext(optionsBuilder.Options);
        }
        #endregion
    }
}
