using Pims.Dal;
using System;
using System.Collections.Generic;
using System.Linq;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a BuildingEvaluations.
        /// </summary>
        /// <param name="buildingId"></param>
        /// <returns></returns>
        public static Entity.BuildingEvaluation CreateBuildingEvaluation(int buildingId)
        {
            return CreateBuildingEvaluation(buildingId, DateTime.Now, Entity.EvaluationKeys.Appraised, Decimal.One);
        }

        /// <summary>
        /// Create a new instance of a BuildingEvaluations.
        /// </summary>
        /// <param name="buildingId"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.BuildingEvaluation CreateBuildingEvaluation(int buildingId, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Appraised, decimal value = 1)
        {
            return new Entity.BuildingEvaluation()
            {
                BuildingId = buildingId,
                Date = date,
                Key = key,
                Value = value,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of BuildingEvaluations.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.BuildingEvaluation> CreateBuildingEvaluations(int buildingId, int startId, int count)
        {
            var evaluations = new List<Entity.BuildingEvaluation>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                evaluations.Add(CreateBuildingEvaluation(buildingId, DateTime.Now.AddDays(i)));
            }
            return evaluations;
        }

        /// <summary>
        /// Create a new instance of a BuildingEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="buildingId"></param>
        /// <returns></returns>
        public static Entity.BuildingEvaluation CreateBuildingEvaluation(this PimsContext context, int buildingId)
        {
            return context.CreateBuildingEvaluation(buildingId, DateTime.Now, Entity.EvaluationKeys.Appraised, Decimal.One);
        }

        /// <summary>
        /// Create a new instance of a BuildingEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="buildingId"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.BuildingEvaluation CreateBuildingEvaluation(this PimsContext context, int buildingId, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Appraised, decimal value = 1)
        {
            var BuildingEvaluation = new Entity.BuildingEvaluation()
            {
                BuildingId = buildingId,
                Date = date,
                Key = key,
                Value = value,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
            context.BuildingEvaluations.Add(BuildingEvaluation);
            return BuildingEvaluation;
        }

        /// <summary>
        /// Create a new List with new instances of BuildingEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.BuildingEvaluation> CreateBuildingEvaluations(this PimsContext context, int buildingId, int startId, int count)
        {
            var evaluations = new List<Entity.BuildingEvaluation>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                evaluations.Add(context.CreateBuildingEvaluation(buildingId, DateTime.Now.AddDays(i)));
            }
            return evaluations;
        }
    }
}
