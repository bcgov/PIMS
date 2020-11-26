using Mapster;
using Microsoft.Extensions.Options;
using Pims.Api.Mapping.Converters;
using Pims.Dal.Helpers.Extensions;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    /// <summary>
    /// ProjectMap class, provides a way to map data from entity to model.
    /// </summary>
    public class ProjectMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public ProjectMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        #region Methods
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Project, Model.ProjectModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear)
                .Map(dest => dest.ActualFiscalYear, src => src.ActualFiscalYear)
                .Map(dest => dest.WorkflowId, src => src.WorkflowId)
                .Map(dest => dest.WorkflowCode, src => src.Workflow.Code)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.StatusCode, src => src.Status.Code)
                .Map(dest => dest.Status, src => src.Status)
                .Map(dest => dest.RiskId, src => src.RiskId)
                .Map(dest => dest.Risk, src => src.Risk.Name)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.TierLevel, src => src.TierLevel == null ? null : src.TierLevel.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Manager, src => src.Manager)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.Properties, src => src.Properties)
                .Map(dest => dest.SubmittedOn, src => src.SubmittedOn)
                .Map(dest => dest.ApprovedOn, src => src.ApprovedOn)
                .Map(dest => dest.DeniedOn, src => src.DeniedOn)
                .Map(dest => dest.CancelledOn, src => src.CancelledOn)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .Map(dest => dest.Tasks, src => src.Tasks)
                .Map(dest => dest.ProjectAgencyResponses, src => src.Responses)
                .Map(dest => dest.Note, src => src.GetNoteText(Entity.NoteTypes.General))
                .Map(dest => dest.PublicNote, src => src.GetNoteText(Entity.NoteTypes.Public))
                .Map(dest => dest.PrivateNote, src => src.GetNoteText(Entity.NoteTypes.Private))
                .Map(dest => dest.OffersNote, src => src.GetNoteText(Entity.NoteTypes.Offer))
                .Map(dest => dest.AppraisedNote, src => src.GetNoteText(Entity.NoteTypes.Appraisal))
                .Map(dest => dest.ExemptionRationale, src => src.GetNoteText(Entity.NoteTypes.Exemption))
                .Map(dest => dest.ReportingNote, src => src.GetNoteText(Entity.NoteTypes.Reporting))
                .Map(dest => dest.Notes, src => src.Notes)
                .AfterMapping((src, dest) =>
                {
                    var metadata = JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(src.Metadata ?? "{}", _serializerOptions);

                    dest.Purchaser = metadata.Purchaser;
                    dest.InitialNotificationSentOn = metadata.InitialNotificationSentOn;
                    dest.ThirtyDayNotificationSentOn = metadata.ThirtyDayNotificationSentOn;
                    dest.SixtyDayNotificationSentOn = metadata.SixtyDayNotificationSentOn;
                    dest.NinetyDayNotificationSentOn = metadata.NinetyDayNotificationSentOn;
                    dest.OnHoldNotificationSentOn = metadata.OnHoldNotificationSentOn;
                    dest.ClearanceNotificationSentOn = metadata.ClearanceNotificationSentOn;
                    dest.TransferredWithinGreOn = metadata.TransferredWithinGreOn;
                    dest.RequestForSplReceivedOn = metadata.RequestForSplReceivedOn;
                    dest.ApprovedForSplOn = metadata.ApprovedForSplOn;
                    dest.MarketedOn = metadata.MarketedOn;
                    dest.OfferAcceptedOn = metadata.OfferAcceptedOn;
                    dest.AssessedOn = metadata.AssessedOn;
                    dest.AdjustedOn = metadata.AdjustedOn;
                    dest.PriorYearAdjustmentOn = metadata.PriorYearAdjustmentOn;
                    dest.ExemptionRequested = metadata.ExemptionRequested;
                    dest.DisposedOn = metadata.DisposedOn;
                    dest.SalesCost = metadata.SalesCost;
                    dest.NetProceeds = metadata.NetProceeds;
                    dest.ProgramCost = metadata.ProgramCost;
                    dest.GainLoss = metadata.GainLoss;
                    dest.SppCapitalization = metadata.SppCapitalization;
                    dest.GainBeforeSpp = metadata.GainBeforeSpp;
                    dest.GainAfterSpp = metadata.GainAfterSpp;
                    dest.OcgFinancialStatement = metadata.OcgFinancialStatement;
                    dest.OfferAmount = metadata.OfferAmount;
                    dest.SaleWithLeaseInPlace = metadata.SaleWithLeaseInPlace;
                    dest.PriorYearAdjustment = metadata.PriorYearAdjustment;
                    dest.PriorYearAdjustmentAmount = metadata.PriorYearAdjustmentAmount;
                    dest.InterestComponent = metadata.InterestComponent;
                    dest.Realtor = metadata.Realtor;
                    dest.RealtorRate = metadata.RealtorRate;
                    dest.RealtorCommission = metadata.RealtorCommission;
                    dest.Remediation = metadata.Remediation;
                    dest.PlannedFutureUse = metadata.PlannedFutureUse;
                    dest.PreliminaryFormSignedOn = metadata.PreliminaryFormSignedOn;
                    dest.PreliminaryFormSignedBy = metadata.PreliminaryFormSignedBy;
                    dest.FinalFormSignedOn = metadata.FinalFormSignedOn;
                    dest.FinalFormSignedBy = metadata.FinalFormSignedBy;
                })
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectModel, Entity.Project>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear)
                .Map(dest => dest.ActualFiscalYear, src => src.ActualFiscalYear)
                .Map(dest => dest.WorkflowId, src => src.WorkflowId)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.RiskId, src => src.RiskId)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Manager, src => src.Manager)
                .Map(dest => dest.Properties, src => src.Properties)
                .Map(dest => dest.SubmittedOn, src => src.SubmittedOn)
                .Map(dest => dest.ApprovedOn, src => src.ApprovedOn)
                .Map(dest => dest.DeniedOn, src => src.DeniedOn)
                .Map(dest => dest.CancelledOn, src => src.CancelledOn)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .Map(dest => dest.Tasks, src => src.Tasks)
                .Map(dest => dest.Responses, src => src.ProjectAgencyResponses)
                .Map(dest => dest.Notes, src => src.Notes)
                .AfterMapping((src, dest) => {
                    var metadata = new Entity.Models.DisposalProjectMetadata()
                    {
                        Purchaser = src.Purchaser,
                        InitialNotificationSentOn = src.InitialNotificationSentOn,
                        ThirtyDayNotificationSentOn = src.ThirtyDayNotificationSentOn,
                        SixtyDayNotificationSentOn = src.SixtyDayNotificationSentOn,
                        NinetyDayNotificationSentOn = src.NinetyDayNotificationSentOn,
                        OnHoldNotificationSentOn = src.OnHoldNotificationSentOn,
                        ClearanceNotificationSentOn = src.ClearanceNotificationSentOn,
                        TransferredWithinGreOn = src.TransferredWithinGreOn,
                        RequestForSplReceivedOn = src.RequestForSplReceivedOn,
                        ApprovedForSplOn = src.ApprovedForSplOn,
                        MarketedOn = src.MarketedOn,
                        OfferAcceptedOn = src.OfferAcceptedOn,
                        AssessedOn = src.AssessedOn,
                        AdjustedOn = src.AdjustedOn,
                        PriorYearAdjustmentOn = src.PriorYearAdjustmentOn,
                        ExemptionRequested = src.ExemptionRequested,
                        DisposedOn = src.DisposedOn,
                        SalesCost = src.SalesCost,
                        NetProceeds = src.NetProceeds,
                        ProgramCost = src.ProgramCost,
                        GainLoss = src.GainLoss,
                        SppCapitalization = src.SppCapitalization,
                        GainBeforeSpp = src.GainBeforeSpp,
                        GainAfterSpp = src.GainAfterSpp,
                        OcgFinancialStatement = src.OcgFinancialStatement,
                        OfferAmount = src.OfferAmount,
                        SaleWithLeaseInPlace = src.SaleWithLeaseInPlace,
                        PriorYearAdjustment = src.PriorYearAdjustment,
                        PriorYearAdjustmentAmount = src.PriorYearAdjustmentAmount,
                        InterestComponent = src.InterestComponent,
                        Realtor = src.Realtor,
                        RealtorRate = src.RealtorRate,
                        RealtorCommission = src.RealtorCommission,
                        Remediation = src.Remediation,
                        PlannedFutureUse = src.PlannedFutureUse,
                        PreliminaryFormSignedOn = src.PreliminaryFormSignedOn,
                        PreliminaryFormSignedBy = src.PreliminaryFormSignedBy,
                        FinalFormSignedOn = src.FinalFormSignedOn,
                        FinalFormSignedBy = src.FinalFormSignedBy
                    };
                    dest.Metadata = JsonSerializer.Serialize(metadata, _serializerOptions);
                    dest.AddOrUpdateNote(Entity.NoteTypes.General, src.Note ?? "");
                    dest.AddOrUpdateNote(Entity.NoteTypes.Public, src.PublicNote ?? "");
                    dest.AddOrUpdateNote(Entity.NoteTypes.Private, src.PrivateNote ?? "");
                    dest.AddOrUpdateNote(Entity.NoteTypes.Appraisal, src.AppraisedNote ?? "");
                    dest.AddOrUpdateNote(Entity.NoteTypes.Offer, src.OffersNote ?? "");
                    dest.AddOrUpdateNote(Entity.NoteTypes.Exemption, src.ExemptionRationale ?? "");
                    dest.AddOrUpdateNote(Entity.NoteTypes.Reporting, src.ReportingNote ?? "");
                })
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
