using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingEvaluation class, provides an entity to map building evaluation values to a date.
    /// </summary>
    public class BuildingEvaluation : BaseEntity
    {
        #region Properties

        /// <summary>
        /// get/set - The primary key and the foreign key to the building.
        /// </summary>
        /// <value></value>
        public int BuildingId { get; set; }

        /// <summary>
        /// get/set - The building.
        /// </summary>
        /// <value></value>
        public Building Building { get; set; }

        /// <summary>
        /// get/set - The primary key and the date the evaluation is for.
        /// </summary>
        /// <value></value>
        public DateTime Date { get; set; }

        /// <summary>
        /// get/set - The key for this fiscal value.
        /// </summary>
        /// <value></value>
        public EvaluationKeys Key { get; set; }

        /// <summary>
        /// get/set - The value of the fiscal key for this building.
        /// </summary>
        /// <value></value>
        public decimal Value { get; set; }

        /// <summary>
        /// get/set - A note related to this fiscal value.
        /// </summary>
        /// <value></value>
        public string Note { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingEvaluation class.
        /// </summary>
        public BuildingEvaluation() { }

        /// <summary>
        /// Creates a new instance of a BuildingEvaluation class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public BuildingEvaluation(Building building, DateTime date, EvaluationKeys key, decimal value)
        {
            this.BuildingId = building?.Id ??
                throw new ArgumentNullException(nameof(building));
            this.Building = building;
            this.Date = date;
            this.Key = key;
            this.Value = value;
        }
        #endregion
    }
}
