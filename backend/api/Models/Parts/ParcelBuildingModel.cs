using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models.Parts
{
    public class ParcelBuildingModel : BaseModel, IEquatable<ParcelBuildingModel>
    {
        #region Properties
        public int Id { get; set; }

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

        public int FiscalYear { get; set; }

        public float EstimatedValue { get; set; }

        public float AssessedValue { get; set; }

        public float NetBookValue { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as ParcelBuildingModel);
        }

        public bool Equals([AllowNull] ParcelBuildingModel other)
        {
            return other != null &&
                Id == other.Id &&
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
                FiscalYear == other.FiscalYear &&
                EstimatedValue == other.EstimatedValue &&
                AssessedValue == other.AssessedValue &&
                NetBookValue == other.NetBookValue;
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(Id);
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
            hash.Add(FiscalYear);
            hash.Add(EstimatedValue);
            hash.Add(AssessedValue);
            hash.Add(NetBookValue);
            return hash.ToHashCode();
        }
        #endregion
    }
}
