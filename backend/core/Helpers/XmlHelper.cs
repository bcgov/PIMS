using ClosedXML.Excel;
using System.Data;

namespace Pims.Core.Helpers
{
    /// <summary>
    /// XmlHelper static class, provides helper methods to generate XML data.
    /// </summary>
    public static class XmlHelper
    {
        /// <summary>
        /// Creates a new XLWorkbook based on the specified 'data'.
        /// </summary>
        /// <param name="data"></param>
        /// <param name="sheetName"></param>
        /// <returns></returns>
        public static XLWorkbook ConvertToXLWorkbook(this DataTable data, string sheetName = "Sheet 1")
        {
            var wb = new XLWorkbook();
            wb.Worksheets.Add(data, sheetName);

            return wb;
        }
    }
}
