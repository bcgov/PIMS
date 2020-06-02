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
        /// Create a new instance of a ParcelEvaluations.
        /// </summary>
        /// <param name="parcelId"></param>
        /// <returns></returns>
        public static Entity.ParcelEvaluation CreateParcelEvaluation(int parcelId)
        {
            return CreateParcelEvaluation(parcelId, DateTime.Now, Entity.EvaluationKeys.Appraised, Decimal.One);
        }

        /// <summary>
        /// Create a new instance of a ParcelEvaluations.
        /// </summary>
        /// <param name="parcelId"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.ParcelEvaluation CreateParcelEvaluation(int parcelId, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Appraised, decimal value = 1)
        {
            return new Entity.ParcelEvaluation()
            {
                ParcelId = parcelId,
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
        /// Create a new List with new instances of ParcelEvaluations.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.ParcelEvaluation> CreateParcelEvaluations(int parcelId, int startId, int count)
        {
            var evaluations = new List<Entity.ParcelEvaluation>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                evaluations.Add(CreateParcelEvaluation(parcelId, DateTime.Now.AddDays(i)));
            }
            return evaluations;
        }

        /// <summary>
        /// Create a new instance of a ParcelEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcelId"></param>
        /// <returns></returns>
        public static Entity.ParcelEvaluation CreateParcelEvaluation(this PimsContext context, int parcelId)
        {
            return context.CreateParcelEvaluation(parcelId, DateTime.Now, Entity.EvaluationKeys.Appraised, Decimal.One);
        }

        /// <summary>
        /// Create a new instance of a ParcelEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcelId"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Entity.ParcelEvaluation CreateParcelEvaluation(this PimsContext context, int parcelId, DateTime date, Entity.EvaluationKeys key = Entity.EvaluationKeys.Appraised, decimal value = 1)
        {
            var parcelEvaluation = new Entity.ParcelEvaluation()
            {
                ParcelId = parcelId,
                Date = date,
                Key = key,
                Value = value,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
            context.ParcelEvaluations.Add(parcelEvaluation);
            return parcelEvaluation;
        }

        /// <summary>
        /// Create a new List with new instances of ParcelEvaluations.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.ParcelEvaluation> CreateParcelEvaluations(this PimsContext context, int parcelId, int startId, int count)
        {
            var evaluations = new List<Entity.ParcelEvaluation>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                evaluations.Add(context.CreateParcelEvaluation(parcelId, DateTime.Now.AddDays(i)));
            }
            return evaluations;
        }
    }
}
