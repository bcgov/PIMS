using System.IO;

namespace Pims.Tools.Converters.ExcelConverter
{
    /// <summary>
    /// IConverter interface, provides structure for converting files into other formats.
    /// </summary>
    public interface IConverter
    {
        /// <summary>
        /// Run each configured source and convert the supplied 'file' to the output.
        /// </summary>
        /// <returns></returns>
        void Run();
    }
}
