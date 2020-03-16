using System;
using System.Data.SqlClient;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

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
                    .AddConsole()
                    .AddEventLog();
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
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddEnvironmentVariables()
                .AddJsonFile("connectionstrings.json", optional : true, reloadOnChange : true)
                .AddJsonFile($"connectionstrings.{environment}.json", optional : true, reloadOnChange : true)
                .AddUserSecrets<PimsContext>()
                .Build();

            var cs = config.GetConnectionString("PIMS");
            var builder = new SqlConnectionStringBuilder(cs)
            {
                Password = config["DB_PASSWORD"]
            };

            var optionsBuilder = new DbContextOptionsBuilder<PimsContext>();
            // optionsBuilder.UseNpgsql (cs, opts => opts.CommandTimeout ((int) TimeSpan.FromMinutes (10).TotalSeconds));
            optionsBuilder.UseSqlServer(builder.ConnectionString, opts => opts.CommandTimeout((int) TimeSpan.FromMinutes(10).TotalSeconds));
            return new PimsContext(optionsBuilder.Options);
        }
        #endregion
    }
}
