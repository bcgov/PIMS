using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ParcelEvaluation class, provides an entity to map parcel evaluation values to a fiscal year.
    /// </summary>
    public class ParcelEvaluation : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key and the fiscal year the evaluation is for.
        /// </summary>
        /// <value></value>
        public int FiscalYear { get; set; }

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
        /// get/set - The estimated value of the parcel.
        /// </summary>
        /// <value></value>
        public float EstimatedValue { get; set; }

        /// <summary>
        /// get/set - The assessed value of the parcel.
        /// </summary>
        /// <value></value>
        public float AssessedValue { get; set; }

        /// <summary>
        /// get/set - The net-book value for this parcel.
        /// </summary>
        /// <value></value>
        public float NetBookValue { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelEvaluation class.
        /// </summary>
        public ParcelEvaluation() { }

        /// <summary>
        /// Creates a new instance of a ParcelEvaluation class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="fiscalYear"></param>
        /// <param name="parcel"></param>
        public ParcelEvaluation(int fiscalYear, Parcel parcel)
        {
            this.FiscalYear = fiscalYear;
            this.ParcelId = parcel?.Id ??
                throw new ArgumentNullException(nameof(parcel));
            this.Parcel = parcel;
            parcel.Evaluations.Add(this);
        }
        #endregion
    }
}
