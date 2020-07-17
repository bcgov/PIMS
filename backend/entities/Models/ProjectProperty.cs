namespace Pims.Dal.Entities.Models
{
    public class ProjectProperty :  Pims.Dal.Entities.Views.Property
    {
        /// <summary>
        /// get/set - The RAEG/SPP project status
        /// </summary>
        public string ProjectStatus { get; set; }

        public ProjectProperty(Pims.Dal.Entities.Views.Property property)
        {
            Id = property.Id;
            PropertyTypeId = property.PropertyTypeId;
            ProjectNumber = property.ProjectNumber;
            Name = property.Name;
            Description = property.Description;
            ClassificationId = property.ClassificationId;
            Classification = property.Classification;
            Agency = property.Agency;
            AgencyId = property.AgencyId;
            AgencyCode = property.AgencyCode;
            SubAgencyCode = property.SubAgencyCode;
            SubAgency = property.SubAgency;
            AddressId = property.AddressId;
            Address = property.Address;
            City = property.City;
            Postal = property.Postal;
            Province = Province;
            Latitude = property.Latitude;
            Longitude = property.Longitude;
            IsSensitive = property.IsSensitive;
            IsVisibleToOtherAgencies = property.IsVisibleToOtherAgencies;
            Estimated = property.Estimated;
            EstimatedFiscalYear = property.EstimatedFiscalYear;
            NetBook = property.NetBook;
            NetBookFiscalYear = property.NetBookFiscalYear;
            Assessed = property.Assessed;
            AssessedDate = property.AssessedDate;
            AppraisedDate = property.AppraisedDate;
            PID = property.PID;
            PIN = property.PIN;
            LandArea = property.LandArea;
            LandLegalDescription = property.LandLegalDescription;
            Municipality = property.Municipality;
            Zoning = property.Zoning;
            ZoningPotential = property.ZoningPotential;
            LocalId = property.LocalId;
            ParcelId = property.ParcelId;
            BuildingConstructionTypeId = property.BuildingConstructionTypeId;
            BuildingConstructionType = property.BuildingConstructionType;
            BuildingFloorCount = property.BuildingFloorCount;
            BuildingPredominateUseId = property.BuildingPredominateUseId;
            BuildingPredominateUse = property.BuildingPredominateUse;
            BuildingTenancy = property.BuildingTenancy;
            RentableArea = property.RentableArea;
            BuildingOccupantType = property.BuildingOccupantType;
            BuildingOccupantTypeId = property.BuildingOccupantTypeId;
            LeaseExpiry = property.LeaseExpiry;
            OccupantName = property.OccupantName;
            TransferLeaseOnSale = property.TransferLeaseOnSale;
        }
    }
}
