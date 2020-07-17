using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Pims.Tools.Converters.ExcelConverter
{
    /// <summary>
    /// Startup class, provides the application starting point to run the console app.
    /// </summary>
    public class Startup
    {
        #region Variables
        private readonly ILogger _logger;
        private readonly IConverter _converter;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Startup class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="converter"></param>
        /// <param name="logger"></param>
        public Startup(IConverter converter, ILogger<Startup> logger)
        {
            _logger = logger;
            _converter = converter;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Run the console application.
        /// </summary>
        /// <param name="args"></param>
        /// <return></return>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Not implemented yet.")]
        public async Task<int> Run(string[] args)
        {
            _logger.LogInformation("Converter Started");

            await _converter.RunAsync();

            _logger.LogInformation("Converter Stopping");

            return 0;
        }
        #endregion
    }
}
