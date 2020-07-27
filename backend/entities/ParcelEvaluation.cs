using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ParcelEvaluation class, provides an entity to map parcel evaluation values to a date.
    /// </summary>
    public class ParcelEvaluation : BaseEntity
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
        /// get/set - The primary key and the date the evaluation is for.
        /// </summary>
        /// <value></value>
        public DateTime Date { get; set; }

        /// <summary>
        /// get/set - the firm that performed this evaluation.
        /// </summary>
        /// <value></value>
        public string Firm { get; set; }

        /// <summary>
        /// get/set - The key for this fiscal value.
        /// </summary>
        /// <value></value>
        public EvaluationKeys Key { get; set; }

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
        /// Creates a new instance of a ParcelEvaluation class.
        /// </summary>
        public ParcelEvaluation() { }

        /// <summary>
        /// Creates a new instance of a ParcelEvaluation class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="date"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public ParcelEvaluation(Parcel parcel, DateTime date, EvaluationKeys key, decimal value)
        {
            this.ParcelId = parcel?.Id ??
                throw new ArgumentNullException(nameof(parcel));
            this.Parcel = parcel;
            this.Date = date;
            this.Key = key;
            this.Value = value;
        }
        #endregion
    }
}
