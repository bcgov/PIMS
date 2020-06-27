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
        /// Create a new instance of a ParcelEvaluations.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.ParcelEvaluation CreateEvaluation(Entity.Parcel parcel, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            return new Entity.ParcelEvaluation()
            {
                ParcelId = parcel.Id,
                Parcel = parcel,
                Date = date,
                Key = key,
                Value = value,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of ParcelEvaluations.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="startDate"></param>
        /// <param name="count"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.ParcelEvaluation> CreateEvaluations(Entity.Parcel parcel, DateTime startDate, int count, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            for (var i = 0; i < count; i++)
            {
                parcel.Evaluations.Add(CreateEvaluation(parcel, startDate.AddYears(i), key, value));
            }
            return parcel.Evaluations as List<Entity.ParcelEvaluation>;
        }

        /// <summary>
        /// Create a new instance of a ParcelEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.ParcelEvaluation CreateEvaluation(this PimsContext context, Entity.Parcel parcel, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            var evaluation = CreateEvaluation(parcel, date, key, value);
            context.ParcelEvaluations.Add(evaluation);
            return evaluation;
        }

        /// <summary>
        /// Create a new List with new instances of ParcelEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="startDate"></param>
        /// <param name="count"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static List<Entity.ParcelEvaluation> CreateEvaluations(this PimsContext context, Entity.Parcel parcel, DateTime startDate, int count, Entity.EvaluationKeys key = Entity.EvaluationKeys.Assessed, decimal value = 1)
        {
            var evaluations = new List<Entity.ParcelEvaluation>(count);
            for (var i = 0; i < count; i++)
            {
                evaluations.Add(context.CreateEvaluation(parcel, startDate.AddYears(i), key, value));
            }
            return evaluations;
        }
    }
}
