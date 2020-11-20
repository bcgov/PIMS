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
        /// Create a new instance of a BuildingFiscals.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="fiscalYear"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.BuildingFiscal CreateFiscal(Entity.Building building, int fiscalYear, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            return new Entity.BuildingFiscal()
            {
                BuildingId = building.Id,
                Building = building,
                FiscalYear = fiscalYear,
                Key = key,
                Value = value,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of BuildingFiscals.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="startFiscalYear"></param>
        /// <param name="count"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingFiscal> CreateFiscals(Entity.Building building, int startFiscalYear, int count, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            for (var i = startFiscalYear; i < (startFiscalYear + count); i++)
            {
                building.Fiscals.Add(CreateFiscal(building, i, key, value));
            }
            return building.Fiscals as List<Entity.BuildingFiscal>;
        }

        /// <summary>
        /// Create a new List with new instances of BuildingFiscals.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="fiscalYears"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingFiscal> CreateFiscals(Entity.Building building, int[] fiscalYears, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            foreach (var fiscalYear in fiscalYears)
            {
                building.Fiscals.Add(CreateFiscal(building, fiscalYear, key, value));
            }
            return building.Fiscals as List<Entity.BuildingFiscal>;
        }

        /// <summary>
        /// Create a new instance of a BuildingFiscals.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="fiscalYear"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.BuildingFiscal CreateFiscal(this PimsContext context, Entity.Building building, int fiscalYear, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            var fiscal = CreateFiscal(building, fiscalYear, key, value);
            context.BuildingFiscals.Add(fiscal);
            return fiscal;
        }

        /// <summary>
        /// Create a new List with new instances of BuildingFiscals.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="startFiscalYear"></param>
        /// <param name="count"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingFiscal> CreateFiscals(this PimsContext context, Entity.Building building, int startFiscalYear, int count, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            var evaluations = new List<Entity.BuildingFiscal>(count);
            for (var i = startFiscalYear; i < (startFiscalYear + count); i++)
            {
                evaluations.Add(context.CreateFiscal(building, i, key, value));
            }
            return evaluations;
        }

        /// <summary>
        /// Create a new List with new instances of BuildingFiscals.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="fiscalYears"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingFiscal> CreateFiscals(this PimsContext context, Entity.Building building, int[] fiscalYears, Entity.FiscalKeys key = Entity.FiscalKeys.Market, decimal value = 1)
        {
            var evaluations = new List<Entity.BuildingFiscal>(fiscalYears.Length);
            foreach (var fiscalYear in fiscalYears)
            {
                evaluations.Add(context.CreateFiscal(building, fiscalYear, key, value));
            }
            return evaluations;
        }
    }
}
