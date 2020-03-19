using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace Pims.Api
{
    /// <summary>
    /// Program class, provides the main program starting point for the Geo-spatial application.
    /// </summary>
    public class Program
    {
        /// <summary>
        /// The primary entry point for the application.
        /// </summary>
        /// <param name="args"></param>
        public static void Main(string[] args)
        {
            var builder = CreateWebHostBuilder(args);
            builder.Build().Run();
        }

        /// <summary>
        /// Create a default configuration and setup for a web application.
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseUrls("http://*:8080")
            .UseStartup<Startup>();
    }
}
