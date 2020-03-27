using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Pims.Api.Models
{
    public class BuildingModel : BaseModel, IEquatable<BuildingModel>
    {
        #region Properties
        public int Id { get; set; }

        public int ParcelId { get; set; }

        public string LocalId { get; set; }

        public string Description { get; set; }

        public AddressModel Address { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public int BuildingConstructionTypeId { get; set; }

        public string BuildingConstructionType { get; set; }

        public int BuildingFloorCount { get; set; }

        public int BuildingPredominateUseId { get; set; }

        public string BuildingPredominateUse { get; set; }

        public string BuildingTenancy { get; set; }

        public float RentableArea { get; set; }

        public IEnumerable<EvaluationModel> Evaluations { get; set; } = new List<EvaluationModel>();

        public override bool Equals(object obj)
        {
            return Equals(obj as BuildingModel);
        }

        public bool Equals([AllowNull] BuildingModel other)
        {
            return other != null &&
                Id == other.Id &&
                ParcelId == other.ParcelId &&
                LocalId == other.LocalId &&
                Description == other.Description &&
                EqualityComparer<AddressModel>.Default.Equals(Address, other.Address) &&
                Latitude == other.Latitude &&
                Longitude == other.Longitude &&
                BuildingConstructionTypeId == other.BuildingConstructionTypeId &&
                BuildingConstructionType == other.BuildingConstructionType &&
                BuildingFloorCount == other.BuildingFloorCount &&
                BuildingPredominateUseId == other.BuildingPredominateUseId &&
                BuildingPredominateUse == other.BuildingPredominateUse &&
                BuildingTenancy == other.BuildingTenancy &&
                RentableArea == other.RentableArea &&
                Enumerable.SequenceEqual(Evaluations, other.Evaluations);
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(Id);
            hash.Add(ParcelId);
            hash.Add(LocalId);
            hash.Add(Description);
            hash.Add(Address);
            hash.Add(Latitude);
            hash.Add(Longitude);
            hash.Add(BuildingConstructionTypeId);
            hash.Add(BuildingConstructionType);
            hash.Add(BuildingFloorCount);
            hash.Add(BuildingPredominateUseId);
            hash.Add(BuildingPredominateUse);
            hash.Add(BuildingTenancy);
            hash.Add(RentableArea);
            hash.Add(Evaluations);
            return hash.ToHashCode();
        }
        #endregion
    }
}
