using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingEvaluation class, provides an entity to map building evaluation values to a fiscal year.
    /// </summary>
    public class BuildingEvaluation : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key and the fiscal year the evaluation is for.
        /// </summary>
        /// <value></value>
        public int FiscalYear { get; set; }

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
        /// get/set - The estimated value of the building.
        /// </summary>
        /// <value></value>
        public float EstimatedValue { get; set; }

        /// <summary>
        /// get/set - The appraised value of the building.
        /// </summary>
        /// <value></value>
        public float AppraisedValue { get; set; }

        /// <summary>
        /// get/set - The assessed value of the building.
        /// </summary>
        /// <value></value>
        public float AssessedValue { get; set; }

        /// <summary>
        /// get/set - The net-book value for this building.
        /// </summary>
        /// <value></value>
        public float NetBookValue { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingEvaluation class.
        /// </summary>
        public BuildingEvaluation() { }

        /// <summary>
        /// Creates a new instance of a BuildingEvaluation class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="fiscalYear"></param>
        /// <param name="building"></param>
        public BuildingEvaluation(int fiscalYear, Building building)
        {
            this.FiscalYear = fiscalYear;
            this.BuildingId = building?.Id ??
                throw new ArgumentNullException(nameof(building));
            this.Building = building;
        }

        /// <summary>
        /// Creates a new instance of a BuildingEvaluation class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="fiscalYear"></param>
        /// <param name="building"></param>
        /// <param name="estimatedValue"></param>
        /// <param name="appraisedValue"></param>
        /// <param name="assessedValue"></param>
        /// <param name="netBookValue"></param>
        public BuildingEvaluation(int fiscalYear, Building building, float estimatedValue, float appraisedValue, float assessedValue, float netBookValue)
        {
            this.FiscalYear = fiscalYear;
            this.BuildingId = building?.Id ??
                throw new ArgumentNullException(nameof(building));
            this.Building = building;
            this.EstimatedValue = estimatedValue;
            this.AppraisedValue = appraisedValue;
            this.AssessedValue = assessedValue;
            this.NetBookValue = netBookValue;
        }
        #endregion
    }
}
