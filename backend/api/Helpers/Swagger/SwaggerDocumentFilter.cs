using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Pims.Api.Helpers.Swagger
{
    /// <summary>
    /// SwaggerDocumentFilter class, provides a way to modify the swagger document information.
    /// </summary>
    public class SwaggerDocumentFilter : IDocumentFilter
    {
        #region Variables
        private readonly IHttpContextAccessor _context;
        private readonly string _basePath;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a SwaggerDocumentFilter object, initializes it with the specified arguments.
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        /// <param name="configuration"></param>
        public SwaggerDocumentFilter(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _context = httpContextAccessor;
            _basePath = configuration.GetValue<string>("BaseUrl");
        }
        #endregion

        #region Methods
        /// <summary>
        /// Apply the requested host to the document servers.
        /// </summary>
        /// <param name="swaggerDoc"></param>
        /// <param name="context"></param>
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            swaggerDoc.Servers.Add(new OpenApiServer() { Url = $"{_context.HttpContext.Request.Scheme}://{_context.HttpContext.Request.Host}{_basePath}" });
        }
        #endregion
    }
}
