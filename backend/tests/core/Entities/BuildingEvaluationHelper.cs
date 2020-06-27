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
        /// Create a new instance of a BuildingEvaluations.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.BuildingEvaluation CreateEvaluation(Entity.Building building, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            return new Entity.BuildingEvaluation()
            {
                BuildingId = building.Id,
                Building = building,
                Date = date,
                Key = key,
                Value = value,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of BuildingEvaluations.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="startDate"></param>
        /// <param name="count"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingEvaluation> CreateEvaluations(Entity.Building building, DateTime startDate, int count, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            for (var i = 0; i < count; i++)
            {
                building.Evaluations.Add(CreateEvaluation(building, startDate.AddYears(i), key, value));
            }
            return building.Evaluations as List<Entity.BuildingEvaluation>;
        }

        /// <summary>
        /// Create a new List with new instances of BuildingEvaluations.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="dates"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingEvaluation> CreateEvaluations(Entity.Building building, DateTime[] dates, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            foreach (var date in dates)
            {
                building.Evaluations.Add(CreateEvaluation(building, date, key, value));
            }
            return building.Evaluations as List<Entity.BuildingEvaluation>;
        }

        /// <summary>
        /// Create a new instance of a BuildingEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.BuildingEvaluation CreateEvaluation(this PimsContext context, Entity.Building building, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            var evaluation = CreateEvaluation(building, date, key, value);
            context.BuildingEvaluations.Add(evaluation);
            return evaluation;
        }

        /// <summary>
        /// Create a new List with new instances of BuildingEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="startDate"></param>
        /// <param name="count"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingEvaluation> CreateEvaluations(this PimsContext context, Entity.Building building, DateTime startDate, int count, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            var evaluations = new List<Entity.BuildingEvaluation>(count);
            for (var i = 0; i < count; i++)
            {
                evaluations.Add(context.CreateEvaluation(building, startDate.AddYears(i), key, value));
            }
            return evaluations;
        }

        /// <summary>
        /// Create a new List with new instances of BuildingEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="dates"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.BuildingEvaluation> CreateEvaluations(this PimsContext context, Entity.Building building, DateTime[] dates, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            var evaluations = new List<Entity.BuildingEvaluation>(dates.Length);
            foreach (var date in dates)
            {
                evaluations.Add(context.CreateEvaluation(building, date, key, value));
            }
            return evaluations;
        }
    }
}
