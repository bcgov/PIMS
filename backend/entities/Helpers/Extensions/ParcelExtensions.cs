using System;
using System.Linq;
using Pims.Dal.Entities;

namespace Pims.Dal.Entities.Helpers.Extensions
{
    /// <summary>
    /// ParcelExtensions static class, provides extension methods for parcels.
    /// </summary>
    public static class ParcelExtensions
    {
        /// <summary>
        /// Get the most recent fiscal for the specified 'key'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetFiscal(this Parcel parcel, FiscalKeys key)
        {
            return parcel.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent fiscal year for the specified 'key'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int? GetFiscalYear(this Parcel parcel, FiscalKeys key)
        {
            return parcel.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.FiscalYear;
        }

        /// <summary>
        /// Get the most recent evaluation for the specified 'key'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetEvaluation(this Parcel parcel, EvaluationKeys key)
        {
            return parcel.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent evaluation date for the specified 'key'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static DateTime? GetEvaluationDate(this Parcel parcel, EvaluationKeys key)
        {
            return parcel.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Date;
        }
    }
}
