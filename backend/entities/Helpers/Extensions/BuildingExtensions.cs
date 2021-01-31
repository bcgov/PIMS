using System;
using System.Linq;
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
        public static decimal? GetEvaluation(this Building building, EvaluationKeys key)
        {
            return building.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent evaluation date for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static DateTime? GetEvaluationDate(this Building building, EvaluationKeys key)
        {
            return building.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == key)?.Date;
        }

        /// <summary>
        /// Get the most recent fiscal for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static decimal? GetFiscal(this Building building, FiscalKeys key)
        {
            return building.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.Value;
        }

        /// <summary>
        /// Get the most recent fiscal year for the specified 'key'.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int? GetFiscalYear(this Building building, FiscalKeys key)
        {
            return building.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == key)?.FiscalYear;
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
