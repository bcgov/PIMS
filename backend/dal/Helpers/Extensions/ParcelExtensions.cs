using System.Linq;
using Microsoft.EntityFrameworkCore;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// ParcelExtensions static class, provides extension methods for parcels.
    /// </summary>
    public static class ParcelExtensions
    {
        /// <summary>
        /// Make a query to determine if the parcel PID and PIN are unique.
        /// - No two parcels should have the same PID (exception below)
        /// - No two parcels should have the same PIN
        /// - A Crown Land parcel without a Title will have a PID=0 and a unique PIN.
        /// </summary>
        /// <param name="parcels"></param>
        /// <param name="parcel"></param>
        /// <exception type="DbUpdateException">The PID and PIN must be unique.</exception>
        public static void ThrowIfNotUnique(this DbSet<Entity.Parcel> parcels, Entity.Parcel parcel)
        {
            var alreadyExists = parcels.Any(p => p.Id != parcel.Id && ((parcel.PID > 0 && p.PID == parcel.PID) || (parcel.PIN != null && p.PIN == parcel.PIN)));
            if (alreadyExists) throw new DbUpdateException("PID and PIN values must be unique.");
        }

        /// <summary>
        /// Make a query to determine if the parcel PID and PIN have been updated on a pre-existing parcel
        /// - once created the unique PID or PIN of a parcel should not be updated.
        /// </summary>
        /// <param name="parcels"></param>
        /// <param name="parcel"></param>
        /// <exception type="DbUpdateException">The PID and PIN may not be updated.</exception>
        public static void ThrowIfPidPinUpdated(this DbSet<Entity.Parcel> parcels, Entity.Parcel parcel)
        {
            var pidPinUpdated = parcels.Any(p => p.Id == parcel.Id && ((parcel.PID > 0 && p.PID != parcel.PID) || (parcel.PIN != null && p.PIN != parcel.PIN)));

            if (pidPinUpdated) throw new DbUpdateException("PID and PIN may not be updated.");
        }
    }
}
