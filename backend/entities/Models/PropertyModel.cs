using System;
using System.Linq;
using System.Security.Claims;
using NetTopologySuite.Geometries;
using Pims.Core.Extensions;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// PropertyModel class, provides a model that represents a property within PIMS.
    /// </summary>
    public abstract class PropertyModel
    {
        #region Properties
        #region Identification
        /// <summary>
        /// get/set - The primary key to identify the property within PIMS.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The type of property [Land|Building]
        /// </summary>
        public PropertyTypes PropertyTypeId { get; set; }

        /// <summary>
        /// get/set - The name of the property.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A description of the property.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Foreign key to the property classification [Core Active|Core Strategic|Surplus Active|Surplus Encumbered|Disposed]
        /// </summary>
        public int ClassificationId { get; set; }

        /// <summary>
        /// get/set - The classification name of the property [Core Active|Core Strategic|Surplus Active|Surplus Encumbered|Disposed]
        /// </summary>
        public string Classification { get; set; }

        /// <summary>
        /// get/set - The SPP project number(s).
        /// </summary>
        public string ProjectNumbers { get; set; }
        /// <summary>
        /// get/set - Whether this is a sensitive property that would be harmful if visible to other agencies.
        /// </summary>
        public bool IsSensitive { get; set; }

        /// <summary>
        /// get/set - The workflow code of this project, if in a project.
        /// </summary>
        public string ProjectWorkflow { get; set; }

        /// <summary>
        /// get/set - The status code of this project, if in a project.
        /// </summary>
        public string ProjectStatus { get; set; }

        /// <summary>
        /// get/set - Whether this property should be fully visible to other agencies (normally during ERP).
        /// </summary>
        /// <value></value>
        public bool IsVisibleToOtherAgencies { get; set; }
        #endregion

        #region Agency
        /// <summary>
        /// get/set - The foreign key to the owning agency.
        /// </summary>
        public int? AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency or ministry name that owns the property.
        /// </summary>
        public string Agency { get; set; }

        /// <summary>
        /// get/set - The code of the parent agency or ministry.
        /// </summary>
        /// <value></value>
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - The sub-agency name that owns the property.
        /// </summary>
        /// <value></value>
        public string SubAgency { get; set; }

        /// <summary>
        /// get/set - The sub-agency code that owns the property.
        /// </summary>
        /// <value></value>
        public string SubAgencyCode { get; set; }
        #endregion

        #region Address
        /// <summary>
        /// get/set - The foreign key to the address of the property.
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// get/set - The address of the property.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The administrative area (city, municipality, district, etc) for this property.
        /// </summary>
        public string AdministrativeArea { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        public string Province { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        public string Postal { get; set; }

        /// <summary>
        /// get/set - The latitude and longitude that identifies the location of the property.
        /// </summary>
        public Point Location { get; set; }

        /// <summary>
        /// get/set - A polygon that represents the boundary of the property.
        /// </summary>
        public Geometry Boundary { get; set; }
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The most recent market value.
        /// </summary>
        public decimal? Market { get; set; }

        /// <summary>
        /// get/set - The fiscal year for the market value.
        /// </summary>
        public int? MarketFiscalYear { get; set; }

        /// <summary>
        /// get/set - The most recent netbook value.
        /// </summary>
        public decimal? NetBook { get; set; }

        /// <summary>
        /// get/set - The fiscal year netbook value.
        /// </summary>
        public int? NetBookFiscalYear { get; set; }
        #endregion
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyModel object.
        /// </summary>
        public PropertyModel() { }

        /// <summary>
        /// Creates a new instance of a PropertyModel object, initializes with specified parameters.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="user"></param>
        public PropertyModel(Views.Property property, ClaimsPrincipal user)
        {
            if (property == null) throw new ArgumentNullException(nameof(property));
            if (user == null) throw new ArgumentNullException(nameof(user));

            this.Id = property.Id;
            this.PropertyTypeId = property.PropertyTypeId;
            this.ClassificationId = property.ClassificationId;
            this.Classification = property.Classification;
            this.IsVisibleToOtherAgencies = property.IsVisibleToOtherAgencies;
            this.ProjectNumbers = property.ProjectNumbers;

            this.AddressId = property.AddressId;
            this.Address = property.Address;
            this.AdministrativeArea = property.AdministrativeArea;
            this.Province = property.Province;
            this.Postal = property.Postal;

            this.Location = property.Location;
            this.Boundary = property.Boundary;

            var userAgencies = user.GetAgenciesAsNullable();

            // The property belongs to the user's agency or sub-agency, so include these properties.
            // TODO: Shuffle code around so that this can use the user.HasPermission(Permissions.AdminProperties).
            if (userAgencies.Contains(property.AgencyId) || user.HasClaim(c => c.Value == "admin-properties"))
            {
                this.Name = property.Name;
                this.Description = property.Description;
                this.IsSensitive = property.IsSensitive;
                this.AgencyId = property.AgencyId;
                this.AgencyCode = property.AgencyCode;
                this.Agency = property.Agency;
                this.SubAgencyCode = property.SubAgencyCode;
                this.SubAgency = property.SubAgency;

                this.Market = property.Market;
                this.MarketFiscalYear = property.MarketFiscalYear;
                this.NetBook = property.NetBook;
                this.NetBookFiscalYear = property.NetBookFiscalYear;
            }
        }
        #endregion
    }
}
