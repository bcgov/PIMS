using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Project class, provides an entity for the datamodel to manage projects.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Project : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key provides a unique identity for the project.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique identity for the project.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - A display name to identify the project.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Foreign key to the current workflow the project is in.
        /// </summary>
        public int? WorkflowId { get; set; }

        /// <summary>
        /// get/set - The current workflow the project is in.
        /// </summary>
        public Workflow Workflow { get; set; }

        /// <summary>
        /// get/set - The project manager name(s).
        /// </summary>
        public string Manager { get; set; }

        /// <summary>
        /// get/set - The reported fiscal year this project.
        /// </summary>
        public int ReportedFiscalYear { get; set; }

        /// <summary>
        /// get/set - The actual or forecasted fiscal year.
        /// </summary>
        public int ActualFiscalYear { get; set; }

        /// <summary>
        /// get/set - The foreign key to the owning agency.
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The owning agency.
        /// </summary>
        public Agency Agency { get; set; }

        /// <summary>
        /// get/set - The foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The project status.
        /// </summary>
        public ProjectStatus Status { get; set; }

        /// <summary>
        /// get/set - A description of the project.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - A simple way to capture notes for the project.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - The foreign key to the tier level.
        /// </summary>
        public int TierLevelId { get; set; }

        /// <summary>
        /// get/set - The tier level.
        /// </summary>
        public TierLevel TierLevel { get; set; }

        /// <summary>
        /// get/set - Foreign key to the risk level of the project.
        /// </summary>
        public int RiskId { get; set; }

        /// <summary>
        /// get/set - The risk level of the project.
        /// </summary>
        public ProjectRisk Risk { get; set; }

        /// <summary>
        /// get/set - A shared note between SRES and agency.
        /// </summary>
        public string PublicNote { get; set; }

        /// <summary>
        /// get/set - A private note for SRES only.
        /// </summary>
        public string PrivateNote { get; set; }

        /// <summary>
        /// get/set - Additional serialized metadata.
        /// </summary>
        public string Metadata { get; set; }

        #region SPL
        /// <summary>
        /// get/set - When the project was externally marketed.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? MarketedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Note summerizing offers received.
        /// </summary>
        public string OffersNote { get; set; }

        /// <summary>
        /// get/set - Text field describing project purchaser.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public string Purchaser { get; set; }

        /// <summary>
        /// get/set - Whether or not the contract for the project is conditional
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public bool? IsContractConditional { get; set; }
        #endregion

        #region Dates
        /// <summary>
        /// get/set - When the project was submitted.
        /// </summary>
        public DateTime? SubmittedOn { get; set; }

        /// <summary>
        /// get/set - When the project was approved.
        /// </summary>
        public DateTime? ApprovedOn { get; set; }

        /// <summary>
        /// get/set - When the on hold enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? OnHoldNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the initial enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? InitialNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the 30 day enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? ThirtyDayNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the 60 day enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? SixtyDayNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the 90 day enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? NinetyDayNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project was transferred within the GRE.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? TransferredWithinGreOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the clearance enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? ClearanceNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project was denied.
        /// </summary>
        public DateTime? DeniedOn { get; set; }

        /// <summary>
        /// get/set - When the project was cancelled.
        /// </summary>
        public DateTime? CancelledOn { get; set; }

        /// <summary>
        /// get/set - When the offer was accepted on.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? OfferAcceptedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project was disposed.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public DateTime? DisposedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project was completed.
        /// </summary>
        /// <value></value>
        public DateTime? CompletedOn { get; set; }
        #endregion

        #region Exemption
        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public bool ExemptionRequested { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The rational for the exemption from ERP.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public string ExemptionRationale { get; set; } // TODO: Move to metadata property.
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The netbook value which is the sum of the properties.
        /// </summary>
        public decimal NetBook { get; set; }

        /// <summary>
        /// get/set - The estimated value which is the sum of the properties.
        /// </summary>
        public decimal Estimated { get; set; }

        /// <summary>
        /// get/set - The assessed value which is the sum of the properties.
        /// </summary>
        public decimal Assessed { get; set; }

        /// <summary>
        /// get/set - The sales cost.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public decimal SalesCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public decimal NetProceeds { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The program cost.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public decimal ProgramCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public decimal GainLoss { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - OCG final statement.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public decimal? OcgFinancialStatement { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Record the interest component.
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public decimal InterestComponent { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Amount offered during SPL
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public decimal OfferAmount { get; set; }

        /// <summary>
        /// get/set - Whether the sale includes a lease in place (SLIP).
        /// </summary>
        [NotMapped]
        [JsonProperty]
        public bool SaleWithLeaseInPlace { get; set; } // TODO: Move to metadata property.
        #endregion

        /// <summary>
        /// get - A collection of properties associated to this project.
        /// </summary>
        public ICollection<ProjectProperty> Properties { get; } = new List<ProjectProperty>();

        /// <summary>
        /// get - A collection of tasks associated to this project.
        /// </summary>
        public ICollection<ProjectTask> Tasks { get; } = new List<ProjectTask>();

        /// <summary>
        /// get - A collection of responses from notifications for this project.
        /// </summary>
        public ICollection<ProjectAgencyResponse> Responses { get; } = new List<ProjectAgencyResponse>();

        /// <summary>
        /// get - A collection of notifications sent for this project.
        /// </summary>
        public ICollection<NotificationQueue> Notifications { get; } = new List<NotificationQueue>();

        /// <summary>
        /// get - A collection of notes for this project.
        /// </summary>
        public ICollection<ProjectNote> Notes { get; } = new List<ProjectNote>();

        /// <summary>
        /// get - A collection of snapshots of this project.
        /// </summary>
        public ICollection<ProjectSnapshot> Snapshots { get; } = new List<ProjectSnapshot>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Project class.
        /// </summary>
        public Project() { }

        /// <summary>
        /// Create a new instance of a Project class, initializes with specified arguments
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="name"></param>
        /// <param name="tierLevel"></param>
        public Project(string projectNumber, string name, TierLevel tierLevel)
        {
            if (String.IsNullOrWhiteSpace(projectNumber)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(projectNumber));
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(name));

            this.ProjectNumber = projectNumber;
            this.Name = name;
            this.TierLevelId = tierLevel?.Id ?? throw new ArgumentNullException(nameof(tierLevel));
            this.TierLevel = tierLevel;
        }
        #endregion
    }
}
