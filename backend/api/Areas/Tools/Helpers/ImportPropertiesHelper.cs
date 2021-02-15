using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Dal.Services.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

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
        private readonly IList<Entity.Agency> _agencies;
        private readonly Dictionary<string, string> _agencyCodeCorrections = new Dictionary<string, string>() { { "BT", "BCT" }, { "ICOB", "ICBC" } }; // TODO: Move logic to converter tool
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
            _propertyClassifications = _pimsAdminService.PropertyClassification.GetAll().ToList();
            _agencies = _pimsAdminService.Agency.GetAll().ToList();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Parse the value to extract the PID number.
        /// If it's invalid it will return -1.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private int ParsePid(string value)
        {
            if (int.TryParse(value?.Replace("-", ""), out int pid))
                return pid;

            return -1;
        }

        /// <summary>
        /// Delete properties from inventory that match the parcel PID or building name.
        /// </summary>
        /// <param name="properties"></param>
        /// <param name="updatedBefore">Only allow deletes to properties updated before this date.</param>
        /// <returns></returns>
        public IEnumerable<Entity.Property> DeleteProperties(IEnumerable<Model.ImportPropertyModel> properties, DateTime? updatedBefore = null)
        {
            if (properties == null) throw new ArgumentNullException(nameof(properties));

            var results = new List<Entity.Property>();
            foreach (var property in properties)
            {
                var pid = ParsePid(property.ParcelId ?? property.PID);
                _logger.LogDebug($"Requesting to remove property pid:{pid}, type:{property.PropertyType}, local:{property.LocalId}");

                // Ignore invalid PID values or '000-000-000'.
                if (pid < 1) continue;

                switch (property.PropertyType?.ToLower())
                {
                    case "parcel":
                    case "land":
                        var parcel = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Parcel.GetByPid(pid));
                        // Only delete the parcel if it exists in inventory.
                        if (parcel != null && (updatedBefore == null || parcel.UpdatedOn == null || parcel.UpdatedOn < updatedBefore))
                        {
                            _pimsAdminService.Parcel.Remove(parcel);
                            results.Add(parcel);
                            _logger.LogInformation($"Deleting parcel pid:{pid}");
                        }
                        break;
                    case "building":
                        var name = $"{(String.IsNullOrWhiteSpace(property.LocalId) ? "" : $"{property.LocalId} ")}{property.Description}";
                        // Searching for a name may result in multiple matches.
                        //
                        var buildings = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Building.GetByName(name));

                        foreach (var building in buildings.ToArray())
                        {
                            _pimsAdminService.Building.LoadParcelsFor(building);
                            // Only delete the building if it exists in inventory
                            // If it hasn't been updated after the 'updatedBefore' date
                            // If the building exists on the specified 'pid' or the building address matches
                            if ((updatedBefore == null || building.UpdatedOn == null || building.UpdatedOn < updatedBefore)
                                && ((building.Parcels.Count() == 0
                                    && building.Address.Address1 == property.CivicAddress
                                    && building.Address.AdministrativeArea == property.City)
                                || building.Parcels.Any(p => p.Parcel.PID == pid)))
                            {
                                _pimsAdminService.Building.Remove(building);
                                results.Add(building);
                                _logger.LogInformation($"Deleting building pid:{pid} name:{name}");
                            }
                        }
                        break;
                }
            }

            return results;
        }

        /// <summary>
        /// Update the specified property financials only.
        /// This will only add new financial year values to existing properties.
        /// All other property metadata will remain unchanged.
        /// </summary>
        /// <param name="properties"></param>
        /// <returns></returns>
        public IEnumerable<Entity.Parcel> UpdatePropertyFinancials(IEnumerable<Model.ImportPropertyModel> properties)
        {
            if (properties == null) throw new ArgumentNullException(nameof(properties));

            var entities = new List<Entity.Parcel>();
            foreach (var property in properties)
            {
                var parcelId = property.ParcelId ?? property.PID;
                _logger.LogDebug($"Update property financials pid:{parcelId}, type:{property.PropertyType}, fiscal:{property.FiscalYear}, local:{property.LocalId}");

                var validPid = int.TryParse(parcelId?.Replace("-", ""), out int pid);
                if (!validPid) continue;

                if (String.Compare(property.PropertyType, "Land") == 0)
                {
                    entities.Add(UpdateParcelFinancials(property, pid));
                }
                else if (String.Compare(property.PropertyType, "Building") == 0)
                {
                    UpdateBuildingFinancials(property, pid);
                }
            }

            return entities;
        }

        /// <summary>
        /// Check if the parcel exists, if it does then it will update the financials if there are newer values provided.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        private Entity.Parcel UpdateParcelFinancials(Model.ImportPropertyModel property, int pid)
        {
            var p_e = ExceptionHelper.HandleKeyNotFoundWithDefault(() => _pimsAdminService.Parcel.GetByPid(pid));
            var evaluationDate = new DateTime(property.FiscalYear, 1, 1); // Defaulting to Jan 1st because SIS data doesn't have the actual date.

            // Ignore properties that are not part of inventory.
            if (p_e.Id == 0) return null;

            // Add a new fiscal values for each year.
            if (!p_e.Fiscals.Any(e => e.FiscalYear == property.FiscalYear))
            {
                p_e.Fiscals.Add(new Entity.ParcelFiscal(p_e, property.FiscalYear, Entity.FiscalKeys.NetBook, property.NetBook));
            }

            // Add a new evaluation if new.
            if (!p_e.Evaluations.Any(e => e.Date == evaluationDate))
            {
                p_e.Evaluations.Add(new Entity.ParcelEvaluation(p_e, evaluationDate, Entity.EvaluationKeys.Assessed, property.Assessed));
            }

            _pimsAdminService.Parcel.UpdateFinancials(p_e);
            _logger.LogDebug($"Updating parcel '{property.PID}'");

            return p_e;
        }

        /// <summary>
        /// Check if the building exists, if it does then it will update the financials if there are newer values provided.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        private Entity.Building UpdateBuildingFinancials(Model.ImportPropertyModel property, int pid)
        {
            var lid = property.LocalId;
            var b_e = ExceptionHelper.HandleKeyNotFoundWithDefault(() => _pimsAdminService.Building.GetByPid(pid, lid).FirstOrDefault());
            var evaluationDate = new DateTime(property.FiscalYear, 1, 1); // Defaulting to Jan 1st because SIS data doesn't have the actual date.

            // Ignore properties that are not part of inventory.
            if (b_e.Id == 0) return null;

            // Add a new fiscal values for each year.
            if (!b_e.Fiscals.Any(e => e.FiscalYear == property.FiscalYear))
            {
                b_e.Fiscals.Add(new Entity.BuildingFiscal(b_e, property.FiscalYear, Entity.FiscalKeys.NetBook, property.NetBook));
            }

            // Add a new evaluation if new.
            if (!b_e.Evaluations.Any(e => e.Date == evaluationDate))
            {
                b_e.Evaluations.Add(new Entity.BuildingEvaluation(b_e, evaluationDate, Entity.EvaluationKeys.Assessed, property.Assessed));
            }

            _pimsAdminService.Building.UpdateFinancials(b_e);
            _logger.LogDebug($"Updating building '{property.PID}:{property.LocalId}'");

            return b_e;
        }

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
                var parcelId = property.ParcelId ?? property.PID;
                _logger.LogDebug($"Add/Update property pid:{parcelId}, type:{property.PropertyType}, fiscal:{property.FiscalYear}, local:{property.LocalId}");

                var validPid = int.TryParse(parcelId?.Replace("-", ""), out int pid);
                if (!validPid) continue;

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
            // Find the parent agency.
            var agencyCode = property.AgencyCode.ConvertToUTF8();
            var subAgencyName = property.SubAgency.ConvertToUTF8();
            var agency = _agencies.FirstOrDefault(a => a.Code == agencyCode) ?? throw new KeyNotFoundException($"Agency does not exist '{property.AgencyCode}'");

            // Find or create a sub-agency.
            if (!String.IsNullOrWhiteSpace(subAgencyName))
            {
                var createCode = new string(subAgencyName.GetFirstLetterOfEachWord(true).Take(6).ToArray()).Trim();

                //check if this agency mapping needs to be corrected.
                if (_agencyCodeCorrections.TryGetValue(createCode, out string mappedCode))
                {
                    createCode = mappedCode;
                }
                var subAgency = _agencies.FirstOrDefault(a =>
                    (a.ParentId == agency.Id && a.Name == subAgencyName)
                    || (a.ParentId == agency.Id && a.Code == createCode)
                    || a.Code == subAgencyName
                    || a.Name == subAgencyName);

                if (subAgency == null)
                {
                    subAgency = new Entity.Agency(createCode, subAgencyName)
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
        /// Add or update the parcel in the datasource.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="pid"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        private Entity.Parcel AddUpdateParcel(Model.ImportPropertyModel property, int pid, Entity.Agency agency)
        {
            var p_e = ExceptionHelper.HandleKeyNotFoundWithDefault(() => _pimsAdminService.Parcel.GetByPidWithoutTracking(pid));
            p_e.PropertyTypeId = (int)Entity.PropertyTypes.Land;
            var fiscalYear = property.FiscalYear;
            var evaluationDate = new DateTime(fiscalYear, 1, 1); // Defaulting to Jan 1st because SIS data doesn't have the actual date.

            // Copy properties over to entity.
            p_e.PID = pid;

            // Determine if the last evaluation or fiscal values in the datasource are older than the one currently being imported.
            var fiscalNetBook = p_e.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == Entity.FiscalKeys.NetBook && f.FiscalYear > fiscalYear);
            var evaluationAssessed = p_e.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == Entity.EvaluationKeys.Assessed && e.Date > evaluationDate);

            // Only want to update the properties with the latest information.
            if (p_e.Id == 0 || fiscalNetBook == null || evaluationAssessed == null)
            {
                p_e.AgencyId = agency?.Id ?? throw new KeyNotFoundException($"Agency '{property.Agency}' does not exist.");
                p_e.Agency = agency;
                p_e.Name = GenerateName(property.Name, property.Description);
                p_e.Description = property.Description.ConvertToUTF8(false);
                var lng = property.Longitude != 0 ? property.Longitude : p_e.Location?.X ?? 0; // This is to stop data from some imports resulting in removing the lat/long.
                var lat = property.Latitude != 0 ? property.Latitude : p_e.Location?.Y ?? 0;
                p_e.Location = new NetTopologySuite.Geometries.Point(lng, lat) { SRID = 4326 };
                p_e.LandArea = property.LandArea != 0 ? property.LandArea : p_e.LandArea;
                p_e.LandLegalDescription = property.LandLegalDescription.ConvertToUTF8();

                Entity.PropertyClassification propClassification;
                if (String.Compare("Active", property.Status, true) == 0)
                {
                    propClassification = _propertyClassifications.FirstOrDefault(pc => String.Compare(pc.Name, property.Classification, true) == 0)
                        ?? throw new KeyNotFoundException($"Property Classification '{property.Classification}' does not exist.");
                }
                else
                {
                    propClassification = _propertyClassifications.FirstOrDefault(pc => pc.Name == "Disposed") ?? throw new KeyNotFoundException($"Property Classification '{property.Status}' does not exist.");
                }

                p_e.ClassificationId = propClassification.Id;
                p_e.Classification = propClassification;

                // TODO: Handle this issue more gracefully.
                var city = _pimsAdminService.AdministrativeArea.Get(property.City.ConvertToUTF8()) ?? throw new InvalidOperationException($"Administrative area '{property.City}' does not exist in the datasource.");

                // Add/Update the address.
                if (p_e.AddressId == 0)
                {
                    _logger.LogDebug($"Adding address for parcel '{property.PID}'.");

                    var address = new Entity.Address(property.CivicAddress.ConvertToUTF8(), null, city.Name, "BC", property.Postal.ConvertToUTF8());
                    p_e.Address = address;
                }
                else
                {
                    p_e.Address.Address1 = property.CivicAddress.ConvertToUTF8();
                    p_e.Address.AdministrativeArea = city.Name;
                    p_e.Address.Postal = property.Postal.ConvertToUTF8();
                }
            }

            // Add a new fiscal values for each year.
            if (!p_e.Fiscals.Any(e => e.FiscalYear == fiscalYear))
            {
                p_e.Fiscals.Add(new Entity.ParcelFiscal(p_e, fiscalYear, Entity.FiscalKeys.NetBook, property.NetBook));
            }

            // Add a new evaluation if new.
            if (!p_e.Evaluations.Any(e => e.Date == evaluationDate))
            {
                p_e.Evaluations.Add(new Entity.ParcelEvaluation(p_e, evaluationDate, Entity.EvaluationKeys.Assessed, property.Assessed));
            }

            // A new parcel.
            if (p_e.Id == 0)
            {
                _pimsAdminService.Parcel.Add(p_e);
                _logger.LogDebug($"Adding parcel '{property.PID}'");
            }
            else
            {
                _pimsAdminService.Parcel.Update(p_e);
                _logger.LogDebug($"Updating parcel '{property.PID}'");
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
            var name = GenerateName(property.Name, property.Description, property.LocalId);
            // Multiple buildings could be returned for the PID and Name.
            var b_e = ExceptionHelper.HandleKeyNotFoundWithDefault(() => _pimsAdminService.Building.GetByPidWithoutTracking(pid, name).FirstOrDefault(n => n.Name == name) ?? throw new KeyNotFoundException());
            var evaluationDate = new DateTime(property.FiscalYear, 1, 1); // Defaulting to Jan 1st because SIS data doesn't have the actual date.
            // Find parcel
            var parcel = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Parcel.GetByPidWithoutTracking(pid));

            // Determine if the last evaluation or fiscal values are older than the one currently being imported.
            var fiscalNetBook = b_e.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == Entity.FiscalKeys.NetBook && f.FiscalYear > property.FiscalYear);
            var evaluationAssessed = b_e.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == Entity.EvaluationKeys.Assessed && e.Date > evaluationDate);

            // If the parcel doesn't exist yet we'll need to create a temporary one.
            if (parcel == null)
            {
                parcel = AddUpdateParcel(property, pid, agency);
                _logger.LogWarning($"Parcel '{property.PID}' was generated for a building that had no parcel.");
            }

            // Only want to update the properties with the latest information.
            if (b_e.Id == 0 || fiscalNetBook == null || evaluationAssessed == null)
            {
                // Copy properties over to entity.
                b_e.PropertyTypeId = (int)Entity.PropertyTypes.Building;
                b_e.AgencyId = agency?.Id ?? throw new KeyNotFoundException($"Agency '{property.Agency}' does not exist.");
                b_e.Agency = agency;
                if (!b_e.Parcels.Any(pb => pb.ParcelId == parcel.Id))
                    b_e.Parcels.Add(new Entity.ParcelBuilding(parcel, b_e) { Parcel = null, Building = null });
                b_e.Name = name;
                b_e.Description = property.Description.ConvertToUTF8(false);
                var lng = property.Longitude != 0 ? property.Longitude : b_e.Location?.X ?? 0; // This is to stop data from some imports resulting in removing the lat/long.
                var lat = property.Latitude != 0 ? property.Latitude : b_e.Location?.Y ?? 0;
                b_e.Location = new NetTopologySuite.Geometries.Point(lng, lat) { SRID = 4326 };
                b_e.RentableArea = property.BuildingRentableArea;
                b_e.BuildingFloorCount = property.BuildingFloorCount;
                b_e.BuildingTenancy = property.BuildingTenancy.ConvertToUTF8();
                b_e.TransferLeaseOnSale = false;

                Entity.PropertyClassification propClassification;
                if (String.Compare("Active", property.Status, true) == 0)
                {
                    propClassification = _propertyClassifications.FirstOrDefault(pc => String.Compare(pc.Name, property.Classification, true) == 0) ??
                    throw new KeyNotFoundException($"Property Classification '{property.Classification}' does not exist.");
                }
                else
                {
                    propClassification = _propertyClassifications.FirstOrDefault(pc => pc.Name == "Disposed") ?? throw new KeyNotFoundException($"Property Classification '{property.Status}' does not exist.");
                }

                b_e.ClassificationId = propClassification.Id;
                b_e.Classification = propClassification;

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


                // TODO: Handle this issue more gracefully.
                var city = _pimsAdminService.AdministrativeArea.Get(property.City.ConvertToUTF8()) ?? throw new InvalidOperationException($"Administrative area '{property.City}' does not exist in the datasource.");

                // Add/Update the address.
                if (b_e.AddressId == 0)
                {
                    _logger.LogDebug($"Adding address for building '{property.PID}'-''{property.LocalId}'.");

                    var address = new Entity.Address(property.CivicAddress.ConvertToUTF8(), null, city.Name, "BC", property.Postal.ConvertToUTF8());
                    b_e.Address = address;
                }
                else
                {
                    b_e.Address.Address1 = property.CivicAddress.ConvertToUTF8();
                    b_e.Address.AdministrativeArea = city.Name;
                    b_e.Address.Postal = property.Postal.ConvertToUTF8();
                }
            }

            // Add a new fiscal values for each year.
            if (!b_e.Fiscals.Any(e => e.FiscalYear == property.FiscalYear))
            {
                b_e.Fiscals.Add(new Entity.BuildingFiscal(b_e, property.FiscalYear, Entity.FiscalKeys.NetBook, property.NetBook));
            }

            // Add a new evaluation if new.
            if (!b_e.Evaluations.Any(e => e.Date == evaluationDate))
            {
                b_e.Evaluations.Add(new Entity.BuildingEvaluation(b_e, evaluationDate, Entity.EvaluationKeys.Assessed, property.Assessed));
            }

            // A new building.
            if (b_e.Id == 0)
            {
                _pimsAdminService.Building.Add(b_e);
                _logger.LogDebug($"Adding building '{property.LocalId}' to parcel '{property.PID}'");
            }
            else
            {
                _pimsAdminService.Building.Update(b_e);
                _logger.LogDebug($"Updating building '{property.LocalId}' to parcel '{property.PID}'");
            }

            return parcel;
        }

        /// <summary>
        /// Generates a name with the specified parameters.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <param name="localId"></param>
        /// <returns></returns>
        private string GenerateName(string name, string description = null, string localId = null)
        {
            return (localId == null ? null : $"{localId.ConvertToUTF8()} ") +
                (name != null ? name.ConvertToUTF8() : description?.Substring(0, 150 < description.Length ? 150 : description.Length).Trim().ConvertToUTF8());
        }
        #endregion
    }
}
