using System;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Collections.Generic;

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
            if (Regex.Match(value, "[0-9]{2,4}/[0-9]{2,4}").Success)
            {
                var year = Int32.Parse(value.Split("/").Last());
                return CultureInfo.CurrentCulture.Calendar.ToFourDigitYear(year);
            }

            if (nullable) return null;

            throw new InvalidOperationException($"Unable to convert value '{value}' to integer.");
        }

        /// <summary>
        /// Convert the 'value' to a date value, or null if allowed.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="nullable"></param>
        /// <returns></returns>
        public static DateTime? ConvertToDate(this string value, bool nullable = false)
        {
            if (Regex.Match(value, "^[0-9]{2,4}/[0-9]{2,4}$").Success)
            {
                // A fiscal year has been provided instead.
                var digits = Int32.Parse(value.Split("/").Last());
                var year = CultureInfo.CurrentCulture.Calendar.ToFourDigitYear(digits);
                return new DateTime(year, 1, 1);
            }
            else if (Int64.TryParse(value, out long serial))
            {
                // Excel numeric date value.
                if (serial > 59) serial -= 1; // Excel/Lotus 2/29/1900 bug.
                return new DateTime(1899, 12, 31).AddDays(serial);
            }
            else if (DateTime.TryParse(value, out DateTime date))
                return date;
            else if (Regex.Match(value, "^[0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4}$").Success)
            {
                // A poorly formatted year has been provided, assume mm/dd/yy.
                var parts = value.Split("/");
                var month = Int32.Parse(parts[0]);
                var dayOfMonth = Int32.Parse(parts[1]);
                var year = CultureInfo.CurrentCulture.Calendar.ToFourDigitYear(Int32.Parse(parts[2]));
                return new DateTime(year, month, dayOfMonth);
            }

            if (nullable) return null;

            throw new InvalidOperationException($"Unable to convert value '{value}' to date.");
        }

        /// <summary>
        /// Convert 'value' to boolean, or null if allowed.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="nullable"></param>
        /// <returns></returns>
        public static Boolean? ConvertToBoolean(this string value, bool nullable = false)
        {
            if (Boolean.TryParse(value, out bool result))
                return result;
            else if (Regex.Match(value, "(?i)^yes$").Success)
                return true;
            else if (Regex.Match(value, "(?i)^no$").Success)
                return false;

            if (nullable) return null;
            return false;
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
        /// Replace the specified 'text' value with the specified 'replace' values.
        /// </summary>
        /// <param name="text"></param>
        /// <param name="replace"></param>
        /// <returns></returns>
        public static string ReplaceWith(this string text, params string[] replace)
        {
            if (String.IsNullOrEmpty(text)) return text;
            var value = text;
            foreach (var rvalue in replace)
            {
                if (!String.IsNullOrEmpty(rvalue)) value = value.Replace(rvalue, "");
            }
            return value.Replace(",","").Trim();
        }

        /// <summary>
        /// Convert 'value' to key value pair.
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static KeyValuePair<string, object> ConvertToKeyValuePair(this string key, object value)
        {
            return new KeyValuePair<string, object>(key, value);
        }

        /// <summary>
        /// Replace the specified 'value' with the first value that isn't null in the 'replace' values.
        /// Or return the original 'value'.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="replace"></param>
        /// <returns></returns>
        public static object ChooseNotNull(this object value, params object[] replace)
        {
            foreach (var rvalue in replace)
            {
                if (rvalue != null) return rvalue;
            }
            return value;
        }
    }
}
