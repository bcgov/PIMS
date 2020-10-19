using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Project class, provides an entity for the datamodel to manage projects.
    /// </summary>
    [DataContractAttribute]
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
        [DataMemberAttribute]
        public DateTime? MarketedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Note summerizing offers received.
        /// </summary>
        public string OffersNote { get; set; }

        /// <summary>
        /// get/set - Text field describing project purchaser.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string Purchaser { get; set; }

        /// <summary>
        /// get/set - Whether or not the contract for the project is conditional
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
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
        [DataMemberAttribute]
        public DateTime? OnHoldNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the initial enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? InitialNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the 30 day enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? ThirtyDayNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the 60 day enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? SixtyDayNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the 90 day enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? NinetyDayNotificationSentOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project was transferred within the GRE.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? TransferredWithinGreOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the clearance enhanced referral notification was sent.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
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
        [DataMemberAttribute]
        public DateTime? OfferAcceptedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project was disposed.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? DisposedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project was assessed.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? AssessedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the project had its sale adjusted.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? AdjustedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the preliminary form was signed on.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? PreliminaryFormSignedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the final form was signed on.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? FinalFormSignedOn { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - When the prior year adjustment sale date occurred on.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public DateTime? PriorYearAdjustmentOn { get; set; } // TODO: Move to metadata property.

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
        [DataMemberAttribute]
        public bool ExemptionRequested { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The rational for the exemption from ERP.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string ExemptionRationale { get; set; } // TODO: Move to metadata property.
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The netbook value.
        /// </summary>
        public decimal NetBook { get; set; }

        /// <summary>
        /// get/set - A static netbook value used on the close out form.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? CloseOutNetbook { get; set; }


        /// <summary>
        /// get/set - The estimated value.
        /// </summary>
        public decimal Estimated { get; set; }

        /// <summary>
        /// get/set - The assessed value.
        /// </summary>
        public decimal Assessed { get; set; }

        /// <summary>
        /// get/set - The appraised value.
        /// </summary>
        public decimal Appraised { get; set; }

        /// <summary>
        /// get/set - Information about the appraised value.
        /// </summary>
        public string AppraisedNote { get; set; }

        /// <summary>
        /// get/set - The sales cost.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? SalesCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? NetProceeds { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The baseline integrity is the net proceed variance since the last project report.
        /// This is not stored in the DB but may be returned as a calculated value.
        /// </summary>
        [NotMapped]
        public decimal? BaselineIntegrity { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The sales proceeds
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? SalesProceeds { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The program cost.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? ProgramCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? GainLoss { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The SPP Capitalization value.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? SppCapitalization { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The gain before SPP.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? GainBeforeSpp { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The gain after SPP.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? GainAfterSpp { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - OCG final statement.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? OcgFinancialStatement { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Record the interest component.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? InterestComponent { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Remediation.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string Remediation { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Best information of planned future use.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string PlannedFutureUse { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Amount offered during SPL
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? OfferAmount { get; set; }

        /// <summary>
        /// get/set - Whether the sale includes a lease in place (SLIP).
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public bool SaleWithLeaseInPlace { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Whether an adjustment to prior year sale is required.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public bool PriorYearAdjustment { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Whether an adjustment to prior year sale is required.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? PriorYearAdjustmentAmount { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - the real estate agent
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string Realtor { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - the real estate agent's rate for this project
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string RealtorRate { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - the real estate agent's commission for this project
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public decimal? RealtorCommission { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - who signed the preliminary form.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string PreliminaryFormSignedBy { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - who signed the final form.
        /// </summary>
        [NotMapped]
        [DataMemberAttribute]
        public string FinalFormSignedBy { get; set; } // TODO: Move to metadata property.
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
