using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ParcelFiscal class, provides an entity to map values to a fiscal year.
    /// </summary>
    public class ParcelFiscal : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key and the foreign key to the parcel.
        /// </summary>
        /// <value></value>
        public int ParcelId { get; set; }

        /// <summary>
        /// get/set - The parcel.
        /// </summary>
        /// <value></value>
        public Parcel Parcel { get; set; }

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
        /// get/set - The value of the fiscal key for this parcel.
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
        /// Creates a new instance of a ParcelFiscal class.
        /// </summary>
        public ParcelFiscal() { }

        /// <summary>
        /// Creates a new instance of a ParcelFiscal class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="fiscalYear"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public ParcelFiscal(Parcel parcel, int fiscalYear, FiscalKeys key, decimal value)
        {
            this.ParcelId = parcel?.Id ??
                throw new ArgumentNullException(nameof(parcel));
            this.Parcel = parcel;
            this.FiscalYear = fiscalYear;
            this.Key = key;
            this.Value = value;
        }
        #endregion
    }
}
