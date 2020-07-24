using System;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace Pims.Tools.Converters.ExcelConverter.Converters
{
    /// <summary>
    /// StringConverters static class, provides string converters.
    /// </summary>
    public static class StringConverters
    {
        /// <summary>
        /// Extract the fiscal year from the string (i.e. "13/14" = 2014).
        /// </summary>
        /// <param name="value"></param>
        /// <param name="nullable"></param>
        /// <returns></returns>
        public static int? ConvertToFiscalYear(this string value, bool nullable = false)
        {
            if (Regex.Match(value, "[0-9]{2}/[0-9]{2}").Success)
            {
                var year = Int32.Parse(value.Split("/").Last());
                return CultureInfo.CurrentCulture.Calendar.ToFourDigitYear(year);
            }

            if (nullable) return null;

            throw new InvalidOperationException($"Unable to convert value '{value}' to integer.");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <param name="nullable"></param>
        /// <returns></returns>
        public static DateTime? ConvertToDate(this string value, bool nullable = false)
        {
            if (Regex.Match(value, "[0-9]{2}/[0-9]{2}").Success)
            {
                var digits = Int32.Parse(value.Split("/").Last());
                var year = CultureInfo.CurrentCulture.Calendar.ToFourDigitYear(digits);
                return new DateTime(year, 1, 1);
            }
            else if (Int64.TryParse(value, out long serial))
            {
                if (serial > 59) serial -= 1; // Excel/Lotus 2/29/1900 bug.
                return new DateTime(1899, 12, 31).AddDays(serial);
            }
            else if (DateTime.TryParse(value, out DateTime date))
                return date;

            if (nullable) return null;

            throw new InvalidOperationException($"Unable to convert value '{value}' to date.");
        }

        /// <summary>
        /// Handle formatting of value.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ConvertToTenancy(this string value)
        {
            if (value?.Trim() == "1") return "100%";
            if (value?.Trim() == "is 1") return "100%";
            if (value?.Trim() == "100") return "100%";
            if (value?.Trim() == "100 in Use") return "100%";

            if (Double.TryParse(value, out double result)) return $"{result:P2}";
            return value;
        }

        /// <summary>
        /// Replace the specified 'replace' values from the 'text'
        /// </summary>
        /// <param name="text"></param>
        /// <param name="replace"></param>
        /// <returns></returns>
        public static string ReplaceValues(this string text, params string[] replace)
        {
            if (String.IsNullOrEmpty(text)) return text;
            var value = text;
            foreach (var rvalue in replace)
            {
                if (!String.IsNullOrEmpty(rvalue)) value = value.Replace(rvalue, "");
            }
            return value.Replace(",","").Trim();
        }
    }
}
