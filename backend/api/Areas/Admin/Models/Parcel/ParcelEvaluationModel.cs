using System;
using System.Diagnostics.CodeAnalysis;
using Model = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models.Parcel
{
    public class ParcelEvaluationModel : Model.BaseModel, IEquatable<ParcelEvaluationModel>
    {
        #region Properties
        public int ParcelId { get; set; }

        public int FiscalYear { get; set; }

        public float EstimatedValue { get; set; }

        public float AppraisedValue { get; set; }

        public float AssessedValue { get; set; }

        public float NetBookValue { get; set; }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as ParcelEvaluationModel);
        }

        public bool Equals([AllowNull] ParcelEvaluationModel other)
        {
            return other != null &&
                base.Equals(other) &&
                ParcelId == other.ParcelId &&
                FiscalYear == other.FiscalYear &&
                EstimatedValue == other.EstimatedValue &&
                AppraisedValue == other.AppraisedValue &&
                AssessedValue == other.AssessedValue &&
                NetBookValue == other.NetBookValue;
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(base.GetHashCode());
            hash.Add(ParcelId);
            hash.Add(FiscalYear);
            hash.Add(EstimatedValue);
            hash.Add(AppraisedValue);
            hash.Add(AssessedValue);
            hash.Add(NetBookValue);
            return hash.ToHashCode();
        }

        #endregion
    }
}
