using Microsoft.AspNetCore.Mvc;
using Pims.Api.Helpers.Constants;
using Pims.Core.Helpers;
using System.Collections.Generic;
using System.IO;

namespace Pims.Api.Helpers.Reporting
{
    /// <summary>
    /// ReportHelper static class, provides helper functions to generate reports.
    /// </summary>
    public static class ReportHelper
    {
        #region Methods
        /// <summary>
        /// Generates a CSV file for the specified 'items'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <returns></returns>
        public static ContentResult GenerateCsv<T>(IEnumerable<T> items)
        {
            var csv = items.ConvertToCSV();
            var result = new ContentResult
            {
                Content = csv,
                ContentType = ContentTypes.CONTENT_TYPE_CSV
            };
            return result;
        }

        /// <summary>
        /// Generates an Excel document for the specified 'items'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <returns></returns>
        public static FileStreamResult GenerateExcel<T>(IEnumerable<T> items)
        {
            var data = items.ConvertToDataTable();
            var excel = data.ConvertToXLWorkbook("Properties");
            var stream = new MemoryStream();
            excel.SaveAs(stream);
            stream.Position = 0;

            return new FileStreamResult(stream, ContentTypes.CONTENT_TYPE_EXCELX);
        }
        #endregion
    }
}
