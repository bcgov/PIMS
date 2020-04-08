using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Services.Admin;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Tools.Helpers
{
    /// <summary>
    /// ImportPropertiesHelper class, provides a way to import properties into the datasource.
    /// </summary>
    public class ImportPropertiesHelper
    {
        #region Variables
        private readonly IPimsAdminService _pimsAdminService;
        private readonly ILogger _logger;
        private readonly IList<Entity.BuildingConstructionType> _buildingConstructionTypes;
        private readonly IList<Entity.BuildingPredominateUse> _buildingPredominateUses;
        private readonly IList<Entity.PropertyClassification> _propertyClassifications;
        private readonly IList<Entity.PropertyStatus> _propertyStatus;
        private readonly IList<Entity.City> _cities;
        private readonly IList<Entity.Agency> _agencies;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportPropertiesHelper class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsAdminService"></param>
        /// <param name="logger"></param>
        public ImportPropertiesHelper(IPimsAdminService pimsAdminService, ILogger logger)
        {
            _pimsAdminService = pimsAdminService;
            _logger = logger;

            // Preload lookup lists so that they can be references quickly.
            _buildingConstructionTypes = _pimsAdminService.BuildingConstructionType.GetAll().ToList();
            _buildingPredominateUses = _pimsAdminService.BuildingPredominateUse.GetAll().ToList();
            _propertyStatus = _pimsAdminService.PropertyStatus.GetAll().ToList();
            _propertyClassifications = _pimsAdminService.PropertyClassification.GetAll().ToList();
            _cities = _pimsAdminService.City.GetAll().ToList();
            _agencies = _pimsAdminService.Agency.GetAll().ToList();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Adds or updates the property in the datasource.
        /// Determines if the property is a parcel or a building.
        /// Massages some of the data to align with expected values.
        /// </summary>
        /// <param name="properties"></param>
        /// <returns></returns>
        public IEnumerable<Entity.Parcel> AddUpdateProperties(IEnumerable<Model.ImportPropertyModel> properties)
        {
            if (properties == null) throw new ArgumentNullException(nameof(properties));

            var entities = new List<Entity.Parcel>();
            foreach (var property in properties)
            {
                _logger.LogDebug($"Add/Update property pid:{property.ParcelId}, type:{property.PropertyType}, fiscal:{property.FiscalYear}, local:{property.LocalId}");

                var validPid = int.TryParse(property.ParcelId?.Replace("-", ""), out int pid);
                if (!validPid) continue;

                // Change the agency code.
                switch (property.Agency)
                {
                    case "AVED":
                        property.Agency = "AEST";
                        break;
                    case "TRAN":
                        property.Agency = "MOTI";
                        break;
                    case "MTICS":
                        property.Agency = "CITZ";
                        break;
                }

                // Fix postal.
                property.Postal = new string(property.Postal?.Replace(" ", "").Take(6).ToArray());

                var agency = GetOrCreateAgency(property);

                if (String.Compare(property.PropertyType, "Land") == 0)
                {
                    entities.Add(AddUpdateParcel(property, pid, agency));
                }
                else if (String.Compare(property.PropertyType, "Building") == 0)
                {
                    var parcel = AddUpdateBuilding(property, pid, agency);
                    if (!entities.Any(p => p.PID == parcel.PID))
                    {
                        entities.Add(parcel);
                    }
                }
            }

            return entities;
        }

        /// <summary>
        /// Get or create a new agency for the specified property.
        /// </summary>
        /// <param name="property"></param>
        /// <returns></returns>
        private Entity.Agency GetOrCreateAgency(Model.ImportPropertyModel property)
        {
            // Find the agency or create a new one.
            var agency = _agencies.FirstOrDefault(a => a.Code == property.Agency.Trim());

            if (agency == null)
            {
                agency = new Entity.Agency(property.Agency.Trim(), property.Agency);
                _pimsAdminService.Agency.Add(agency);
                _agencies.Add(agency);
                _logger.LogDebug($"Adding agency '{agency.Code}' - '{agency.Name}'.");
            }

            if (!String.IsNullOrWhiteSpace(property.SubAgency))
            {
                var code = new string(property.SubAgency.GetFirstLetterOfEachWord(true).Take(6).ToArray());
                var subAgency = _agencies.FirstOrDefault(a => a.Code == code.Trim() && a.ParentId == agency.Id);

                if (subAgency == null)
                {
                    subAgency = new Entity.Agency(code.Trim(), property.SubAgency)
                    {
                        ParentId = agency.Id,
                        Parent = agency
                    };
                    _pimsAdminService.Agency.Add(subAgency);
                    _agencies.Add(subAgency);
                    _logger.LogDebug($"Adding sub-agency '{subAgency.Code}' - '{agency.Name}', parent: '{subAgency.Parent.Code}'.");
                }

                return subAgency;
            }

            return agency;
        }

        /// <summary>
        /// Get or create a new city for the specified code.
        /// This is a recursive function so that it can generate a new city with a unique code.
        /// It has a limitation of which the code must be 4 characters and therefore it can only handle 9 variations (i.e. BRe1, BRe2...)
        /// </summary>
        /// <param name="code"></param>
        /// <param name="name"></param>
        /// <param name="attempts"></param>
        /// <returns></returns>
        private Entity.City GetOrCreateCity(string code, string name, int attempts = 1)
        {
            if (String.IsNullOrWhiteSpace(code)) throw new ArgumentException($"Argument '{nameof(code)}' is required.");
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException($"Argument '{nameof(name)}' is required.");

            var city = _cities.FirstOrDefault(c => String.Compare(c.Code, code, true) == 0);

            // If City doesn't exist, create it.
            if (city == null)
            {
                city = new Entity.City(code, name);
                _pimsAdminService.City.Add(city);
                _cities.Add(city);

                _logger.LogDebug($"Adding city '{code}' - '{name}'.");
            }
            else
            {
                // Generate a new city code.
                code = $"{new string(code.Take(3).ToArray())}{attempts}";

                // Check if the code is unique.
                city = GetOrCreateCity(code, name, ++attempts);
            }

            return city;
        }

        /// <summary>
        /// Get or create a new city for the specified name.
        /// It will generate a unique city code based on the first initials of the city name, plus the first three characters of the last word.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        private Entity.City GetOrCreateCity(string name)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException($"Argument '{nameof(name)}' is required.");

            var city = _cities.FirstOrDefault(c => String.Compare(c.Name, name, true) == 0);

            // If City doesn't exist, create it.
            if (city == null)
            {
                var code = new string(name.GetFirstLetterOfEachWord(true).Take(4).ToArray());
                var last = new string(name.Split(" ", StringSplitOptions.RemoveEmptyEntries).Last().Take(4).ToArray());
                if (last.Length >= 4) last = last.Substring(1, 3);
                else if (last.Length < 4) last = last.Substring(1, last.Length - 1);

                // Check if the code is unique.
                city = _cities.FirstOrDefault(c => String.Compare(c.Code, code, true) == 0);

                if (city != null)
                {
                    // Generate a new city code.
                    city = GetOrCreateCity(code, name);
                }
                else
                {
                    city = new Entity.City(code, name);
                    _pimsAdminService.City.Add(city);
                    _cities.Add(city);
                }

                _logger.LogDebug($"Adding city '{code}' - '{name}'.");
            }

            return city;
        }

        /// <summary>
        /// Add or update the parcel in the datasource.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="pid"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        private Entity.Parcel AddUpdateParcel(Model.ImportPropertyModel property, int pid, Entity.Agency agency)
        {
            var p_e = ExceptionHelper.HandleKeyNotFoundWithDefault(() => _pimsAdminService.Parcel.GetByPid(pid));
            var fiscal = int.Parse(property.FiscalYear);

            // Copy properties over to entity.
            p_e.PID = pid;

            // Only want to update the properties with the latest evaluation information.
            if (p_e.Id == 0 || p_e.Evaluation?.FiscalYear > fiscal)
            {
                double.TryParse(property.Latitude, out double latitude);
                double.TryParse(property.Longitude, out double longitude);
                float.TryParse(property.LandArea, out float landArea);

                p_e.AgencyId = agency?.Id ??
                    throw new InvalidOperationException($"Agency '{property.Agency}' does not exist.");
                p_e.Agency = agency;
                p_e.Description = property.Description;
                p_e.Latitude = latitude != 0 ? latitude : p_e.Latitude; // This is to stop data from some imports resulting in removing the lat/long.
                p_e.Longitude = longitude != 0 ? longitude : p_e.Longitude;
                p_e.LandArea = landArea != 0 ? landArea : p_e.LandArea;
                p_e.LandLegalDescription = property.LandLegalDescription;

                // Find foreign key.
                var propClassification = _propertyClassifications.FirstOrDefault(pc => String.Compare(pc.Name, property.Classification, true) == 0) ??
                    throw new InvalidOperationException($"Property Classification '{property.Classification}' does not exist.");
                var propStatus = _propertyStatus.FirstOrDefault(ps => String.Compare(ps.Name, property.Status, true) == 0) ??
                    throw new InvalidOperationException($"Property Status '{property.Status}' does not exist.");

                p_e.ClassificationId = propClassification.Id;
                p_e.Classification = propClassification;
                p_e.StatusId = propStatus.Id;
                p_e.Status = propStatus;

                var city = GetOrCreateCity(property.City);

                // Add/Update the address.
                if (p_e.AddressId == 0)
                {
                    _logger.LogDebug($"Adding address for parcel '{property.ParcelId}'.");

                    var address = new Entity.Address(property.CivicAddress, null, city.Id, "BC", property.Postal);
                    p_e.Address = address;
                }
                else
                {
                    p_e.Address.Address1 = property.CivicAddress;
                    p_e.Address.CityId = city.Id;
                    p_e.Address.Postal = property.Postal;
                }
            }

            // Add a new evaluation for each year.
            if (!p_e.Evaluations.Any(e => e.FiscalYear == fiscal))
            {
                float.TryParse(property.AssessedValue, out float assessedValue);
                float.TryParse(property.NetBookValue, out float netBookValue);

                var evaluation = new Entity.ParcelEvaluation(fiscal, p_e)
                {
                    AssessedValue = assessedValue,
                    NetBookValue = netBookValue
                };
            }

            // A new parcel.
            if (p_e.Id == 0)
            {
                _pimsAdminService.Parcel.Add(p_e);
                _logger.LogDebug($"Adding parcel '{property.ParcelId}'");
            }
            else
            {
                _pimsAdminService.Parcel.Update(p_e);
                _logger.LogDebug($"Updating parcel '{property.ParcelId}'");
            }

            return p_e;
        }

        /// <summary>
        /// Add or update the building in the datasource.
        /// Additionally it will also add building construction types and building predominate uses.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="pid"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        private Entity.Parcel AddUpdateBuilding(Model.ImportPropertyModel property, int pid, Entity.Agency agency)
        {
            var lid = property.LocalId;
            var b_e = ExceptionHelper.HandleKeyNotFoundWithDefault(() => _pimsAdminService.Building.GetByPidAndLocalId(pid, lid));
            var fiscal = int.Parse(property.FiscalYear);

            // Find parcel
            var parcel = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Parcel.GetByPid(pid));

            // If the parcel doesn't exist yet we'll need to create a temporary one.
            if (parcel == null)
            {
                property.Classification = "Core Operational";
                parcel = AddUpdateParcel(property, pid, agency);
                _logger.LogWarning($"Parcel '{property.ParcelId}' was generated for a building that had no parcel.");
            }

            // Only want to update the properties with the latest evaluation information.
            if (b_e.Id == 0 || b_e.Evaluation?.FiscalYear > fiscal)
            {
                double.TryParse(property.Latitude, out double latitude);
                double.TryParse(property.Longitude, out double longitude);
                float.TryParse(property.BuildingRentableArea, out float rentableArea);
                int.TryParse(property.BuildingFloorCount, out int floorCount);

                // Copy properties over to entity.
                b_e.AgencyId = agency?.Id ??
                    throw new InvalidOperationException($"Agency '{property.Agency}' does not exist.");
                b_e.Agency = agency;
                b_e.ParcelId = parcel?.Id ??
                    throw new InvalidOperationException($"Parcel '{property.ParcelId}' does not exist.");
                b_e.LocalId = property.LocalId;
                b_e.Description = property.Description;
                b_e.Latitude = latitude;
                b_e.Longitude = longitude;
                b_e.RentableArea = rentableArea;
                b_e.BuildingFloorCount = floorCount;
                b_e.BuildingTenancy = property.BuildingTenancy;
                b_e.TransferLeaseOnSale = false;

                // Find foreign key.
                var propClassification = _propertyClassifications.FirstOrDefault(pc => String.Compare(pc.Name, property.Classification, true) == 0) ??
                    throw new InvalidOperationException($"Property Classification '{property.Classification}' does not exist.");
                var propStatus = _propertyStatus.FirstOrDefault(ps => String.Compare(ps.Name, property.Status, true) == 0) ??
                    throw new InvalidOperationException($"Property Status '{property.Status}' does not exist.");

                b_e.ClassificationId = propClassification.Id;
                b_e.Classification = propClassification;
                b_e.StatusId = propStatus.Id;
                b_e.Status = propStatus;

                // Find foreign key.
                var build_type = _buildingConstructionTypes.FirstOrDefault(bct => String.Compare(bct.Name, property.BuildingConstructionType, true) == 0);
                var build_use = _buildingPredominateUses.FirstOrDefault(bpu => String.Compare(bpu.Name, property.BuildingPredominateUse, true) == 0);

                // If the building construction type doesn't exist, create it.
                if (build_type == null)
                {
                    var max_id = _buildingConstructionTypes.Max(pc => pc.Id) + 1;
                    build_type = new Entity.BuildingConstructionType(max_id, property.BuildingConstructionType);
                    _pimsAdminService.BuildingConstructionType.Add(build_type);
                    _buildingConstructionTypes.Add(build_type);
                }

                // If the building predominate use doesn't exist, create it.
                if (build_use == null)
                {
                    var max_id = _buildingPredominateUses.Max(pc => pc.Id) + 1;
                    build_use = new Entity.BuildingPredominateUse(max_id, property.BuildingPredominateUse);
                    _pimsAdminService.BuildingPredominateUse.Add(build_use);
                    _buildingPredominateUses.Add(build_use);
                }

                b_e.BuildingConstructionTypeId = build_type.Id;
                b_e.BuildingConstructionType = build_type;
                b_e.BuildingPredominateUseId = build_use.Id;
                b_e.BuildingPredominateUse = build_use;

                var city = GetOrCreateCity(property.City);

                // Add/Update the address.
                if (b_e.AddressId == 0)
                {
                    _logger.LogDebug($"Adding address for building '{property.ParcelId}'-''{property.LocalId}'.");

                    var address = new Entity.Address(property.CivicAddress, null, city.Id, "BC", property.Postal);
                    b_e.Address = address;
                }
                else
                {
                    b_e.Address.Address1 = property.CivicAddress;
                    b_e.Address.CityId = city.Id;
                    b_e.Address.Postal = property.Postal;
                }
            }

            // Add a new evaluation for each year.
            if (!b_e.Evaluations.Any(e => e.FiscalYear == fiscal))
            {
                float.TryParse(property.AssessedValue, out float assessedValue);
                float.TryParse(property.NetBookValue, out float netBookValue);

                var evaluation = new Entity.BuildingEvaluation(fiscal, b_e)
                {
                    AssessedValue = assessedValue,
                    NetBookValue = netBookValue
                };
            }

            // A new building.
            if (b_e.Id == 0)
            {
                _pimsAdminService.Building.Add(b_e);
                _logger.LogDebug($"Adding building '{property.LocalId}' to parcel '{property.ParcelId}'");
            }
            else
            {
                _pimsAdminService.Building.Update(b_e);
                _logger.LogDebug($"Updating building '{property.LocalId}' to parcel '{property.ParcelId}'");
            }

            return parcel;
        }
        #endregion
    }
}
