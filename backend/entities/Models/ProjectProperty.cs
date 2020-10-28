namespace Pims.Dal.Entities.Models
{
    public class ProjectProperty :  Pims.Dal.Entities.Views.Property
    {
        #region Properties
        /// <summary>
        /// get/set - The RAEG/SPP project status
        /// </summary>
        public string ProjectStatus { get; set; }
        #endregion

        #region Constructors
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
            AdministrativeArea = property.AdministrativeArea;
            Postal = property.Postal;
            Province = Province;
            Location = property.Location;
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
            AdministrativeArea = property.AdministrativeArea;
            Zoning = property.Zoning;
            ZoningPotential = property.ZoningPotential;
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
        #endregion
    }
}
