using System;

namespace Pims.Api.Helpers.Extensions
{
    public static class DateTimeExtensions
    {
        public static int ToFiscalYear(this DateTime dateTime)
        {
            return dateTime.Month >= 4 ? dateTime.AddYears(1).Year : dateTime.Year;
        }
    }
}
