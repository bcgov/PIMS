using System;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// DateExtensions static class, provides extension methods for dates.
    /// </summary>
    public static class DateExtensions
    {
        /// <summary>
        /// Return the appropriate year that represents the fiscal year for the specified 'date'.
        /// The beginning of the fiscal year is April 1st.
        /// </summary>
        /// <example>
        /// mm/dd/yyyy
        /// 12/01/2018 = 2018/2019
        /// 01/01/2019 = 2018/2019
        /// 05/01/2019 = 2019/2020
        /// </example>
        /// <param name="date"></param>
        /// <returns></returns>
        public static int GetFiscalYear(this DateTime date)
        {
            return date.Month >= 4 ? date.Year + 1 : date.Year;
        }
    }
}
