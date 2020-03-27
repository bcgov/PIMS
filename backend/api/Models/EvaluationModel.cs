using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models
{
    public class EvaluationModel : BaseModel, IEquatable<EvaluationModel>
    {
        #region Properties
        public int PropertyId { get; set; }

        public int FiscalYear { get; set; }

        public float EstimatedValue { get; set; }

        public float AssessedValue { get; set; }

        public float NetBookValue { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as EvaluationModel);
        }

        public bool Equals([AllowNull] EvaluationModel other)
        {
            return other != null &&
                base.Equals(other) &&
                PropertyId == other.PropertyId &&
                FiscalYear == other.FiscalYear &&
                EstimatedValue == other.EstimatedValue &&
                AssessedValue == other.AssessedValue &&
                NetBookValue == other.NetBookValue;
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(base.GetHashCode());
            hash.Add(PropertyId);
            hash.Add(FiscalYear);
            hash.Add(EstimatedValue);
            hash.Add(AssessedValue);
            hash.Add(NetBookValue);
            return hash.ToHashCode();
        }

        #endregion
    }
}
