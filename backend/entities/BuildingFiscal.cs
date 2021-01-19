using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingFiscal class, provides an entity to map values to a fiscal year.
    /// </summary>
    public class BuildingFiscal : BaseEntity
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
        /// get/set - The primary key and the fiscal year the evaluation is for.
        /// </summary>
        /// <value></value>
        public int FiscalYear { get; set; }

        /// <summary>
        /// get/set - The effective date of this fiscal value
        /// </summary>
        /// <value></value>
        public DateTime? EffectiveDate { get; set; }

        /// <summary>
        /// get/set - The key for this fiscal value.
        /// </summary>
        /// <value></value>
        public FiscalKeys Key { get; set; }

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
        /// Creates a new instance of a BuildingFiscal class.
        /// </summary>
        public BuildingFiscal() { }

        /// <summary>
        /// Creates a new instance of a BuildingFiscal class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="fiscalYear"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public BuildingFiscal(Building building, int fiscalYear, FiscalKeys key, decimal value)
        {
            this.BuildingId = building?.Id ??
                throw new ArgumentNullException(nameof(building));
            this.Building = building;
            this.FiscalYear = fiscalYear;
            this.Key = key;
            this.Value = value;
        }
        #endregion
    }
}
