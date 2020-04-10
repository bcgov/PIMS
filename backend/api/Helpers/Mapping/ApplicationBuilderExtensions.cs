using Mapster;
using Microsoft.AspNetCore.Builder;
using System.Reflection;

namespace Pims.Api.Helpers.Mapping
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseMapster(this IApplicationBuilder app)
        {
            var config = new TypeAdapterConfig();
            config.Scan(Assembly.GetAssembly(typeof(Startup)));

            return app;
        }
    }
}
