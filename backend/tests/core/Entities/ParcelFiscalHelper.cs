using Pims.Dal;
using System;
using System.Collections.Generic;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a ParcelFiscal.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="fiscalYear"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.ParcelFiscal CreateFiscal(Entity.Parcel parcel, int fiscalYear, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            return new Entity.ParcelFiscal()
            {
                ParcelId = parcel.Id,
                Parcel = parcel,
                FiscalYear = fiscalYear,
                Key = key,
                Value = value,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of ParcelFiscal.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="startFiscalYear"></param>
        /// <param name="count"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.ParcelFiscal> CreateFiscals(Entity.Parcel parcel, int startFiscalYear, int count, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            for (var i = startFiscalYear; i < (startFiscalYear + count); i++)
            {
                parcel.Fiscals.Add(CreateFiscal(parcel, i, key, value));
            }
            return parcel.Fiscals as List<Entity.ParcelFiscal>;
        }

        /// <summary>
        /// Create a new List with new instances of ParcelFiscal.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="fiscalYears"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.ParcelFiscal> CreateFiscals(Entity.Parcel parcel, int[] fiscalYears, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            foreach (var fiscalYear in fiscalYears)
            {
                parcel.Fiscals.Add(CreateFiscal(parcel, fiscalYear, key, value));
            }
            return parcel.Fiscals as List<Entity.ParcelFiscal>;
        }

        /// <summary>
        /// Create a new instance of a ParcelFiscal.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="fiscalYear"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.ParcelFiscal CreateFiscal(this PimsContext context, Entity.Parcel parcel, int fiscalYear, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            var evaluation = CreateFiscal(parcel, fiscalYear, key, value);
            context.ParcelFiscals.Add(evaluation);
            return evaluation;
        }

        /// <summary>
        /// Create a new List with new instances of ParcelFiscal.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="startFiscalYear"></param>
        /// <param name="count"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.ParcelFiscal> CreateFiscals(this PimsContext context, Entity.Parcel parcel, int startFiscalYear, int count, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            var evaluations = new List<Entity.ParcelFiscal>(count);
            for (var i = startFiscalYear; i < (startFiscalYear + count); i++)
            {
                evaluations.Add(context.CreateFiscal(parcel, i, key, value));
            }
            return evaluations;
        }

        /// <summary>
        /// Create a new List with new instances of ParcelFiscal.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="fiscalYears"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.ParcelFiscal> CreateFiscals(this PimsContext context, Entity.Parcel parcel, int[] fiscalYears, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            var evaluations = new List<Entity.ParcelFiscal>(fiscalYears.Length);
            foreach (var fiscalYear in fiscalYears)
            {
                evaluations.Add(context.CreateFiscal(parcel, fiscalYear, key, value));
            }
            return evaluations;
        }
    }
}
