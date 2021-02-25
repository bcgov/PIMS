using System;
using System.Linq;
using Pims.Core.Extensions;
namespace Pims.Dal.Entities.Helpers.Extensions
{
    /// <summary>
    /// BuildingExtensions static class, provides extension methods for buildings.
    /// </summary>
    public static class BuildingExtensions
    {
        /// <summary>
        /// Get the most recent evaluation for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetMostRecentEvaluation(this Building building, EvaluationKeys key)
        {
            return building.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent evaluation date for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static DateTime? GetMostRecentEvaluationDate(this Building building, EvaluationKeys key)
        {
            return building.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Date;
        }

        /// <summary>
        /// Get the most recent fiscal for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetMostRecentFiscal(this Building building, FiscalKeys key)
        {
            return building.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent fiscal year for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int? GetMostRecentFiscalYear(this Building building, FiscalKeys key)
        {
            return building.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.FiscalYear;
        }

        /// <summary>
        /// Get the current evaluation for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetCurrentEvaluation(this Building building, EvaluationKeys key)
        {
            return building.Evaluations.FirstOrDefault(e => e.Date.Year == DateTime.Now.Year && e.Key == key)?.Value;
        }

        /// <summary>
        /// Get the current evaluation date for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static DateTime? GetCurrentEvaluationDate(this Building building, EvaluationKeys key)
        {
            return building.Evaluations.FirstOrDefault(e => e.Date.Year == DateTime.Now.Year && e.Key == key)?.Date;
        }

        /// <summary>
        /// Get the current fiscal for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetCurrentFiscal(this Building building, FiscalKeys key)
        {
            return building.Fiscals.FirstOrDefault(f => f.FiscalYear == DateTime.Now.GetFiscalYear() && f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the current fiscal year for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int? GetCurrentFiscalYear(this Building building, FiscalKeys key)
        {
            return building.Fiscals.FirstOrDefault(f => f.FiscalYear == DateTime.Now.GetFiscalYear() && f.Key == key)?.FiscalYear;
        }

        /// <summary>
        /// Get the first parcel relationship that this building is located on.
        /// Note - A building could be located on more than one parcel.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static int? GetPID(this Building building)
        {
            return building.Parcels.FirstOrDefault()?.Parcel?.PID;
        }

        /// <summary>
        /// Get the first parcel relationship that this building is located on.
        /// Note - A building could be located on more than one parcel.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static string GetParcelIdentity(this Building building)
        {
            return building.Parcels.FirstOrDefault()?.Parcel?.ParcelIdentity;
        }

        /// <summary>
        /// Get the first parcel relationship that this building is located on.
        /// Note - A building could be located on more than one parcel.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static int? GetPIN(this Building building)
        {
            return building.Parcels.FirstOrDefault()?.Parcel?.PIN;
        }
    }
}
