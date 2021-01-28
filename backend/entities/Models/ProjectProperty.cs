using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    public class ProjectProperty : Pims.Dal.Entities.Views.Property
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
            Name = property.Name;
            Description = property.Description;
            ClassificationId = property.ClassificationId;
            Classification = property.Classification;

            Agency = property.Agency;
            AgencyId = property.AgencyId;
            AgencyCode = property.AgencyCode;
            SubAgencyCode = property.SubAgencyCode;
            SubAgency = property.SubAgency;

            IsSensitive = property.IsSensitive;
            IsVisibleToOtherAgencies = property.IsVisibleToOtherAgencies;

            AddressId = property.AddressId;
            Address = property.Address;
            AdministrativeArea = property.AdministrativeArea;
            Province = Province;
            Postal = property.Postal;
            Location = property.Location;

            Market = property.Market;
            MarketFiscalYear = property.MarketFiscalYear;
            NetBook = property.NetBook;
            NetBookFiscalYear = property.NetBookFiscalYear;
            Assessed = property.Assessed;
            AssessedDate = property.AssessedDate;
            AppraisedDate = property.AppraisedDate;

            PID = property.PID;
            PIN = property.PIN;
            LandArea = property.LandArea;
            LandLegalDescription = property.LandLegalDescription;
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
