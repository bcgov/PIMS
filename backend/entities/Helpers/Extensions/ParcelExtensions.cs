using System;
using System.Linq;
using Pims.Dal.Entities;
using Pims.Core.Extensions;

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
        public static decimal? GetMostRecentFiscal(this Parcel parcel, FiscalKeys key)
        {
            return parcel.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent fiscal year for the specified 'key'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int? GetMostRecentFiscalYear(this Parcel parcel, FiscalKeys key)
        {
            return parcel.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.FiscalYear;
        }

        /// <summary>
        /// Get the most recent evaluation for the specified 'key'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetMostRecentEvaluation(this Parcel parcel, EvaluationKeys key)
        {
            return parcel.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent evaluation date for the specified 'key'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static DateTime? GetMostRecentEvaluationDate(this Parcel parcel, EvaluationKeys key)
        {
            return parcel.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Date;
        }

        /// <summary>
        /// Get the current evaluation for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetCurrentEvaluation(this Parcel parcel, EvaluationKeys key)
        {
            return parcel.Evaluations.FirstOrDefault(e => e.Date.Year == DateTime.Now.Year && e.Key == key)?.Value;
        }

        /// <summary>
        /// Get the current evaluation date for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static DateTime? GetCurrentEvaluationDate(this Parcel parcel, EvaluationKeys key)
        {
            return parcel.Evaluations.FirstOrDefault(e => e.Date.Year == DateTime.Now.Year && e.Key == key)?.Date;
        }

        /// <summary>
        /// Get the current fiscal for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetCurrentFiscal(this Parcel parcel, FiscalKeys key)
        {
            return parcel.Fiscals.FirstOrDefault(f => f.FiscalYear == DateTime.Now.GetFiscalYear() && f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the current fiscal year for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int? GetCurrentFiscalYear(this Parcel parcel, FiscalKeys key)
        {
            return parcel.Fiscals.FirstOrDefault(f => f.FiscalYear == DateTime.Now.GetFiscalYear() && f.Key == key)?.FiscalYear;
        }
    }
}
