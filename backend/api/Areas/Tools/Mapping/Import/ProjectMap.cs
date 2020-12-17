using Mapster;
using Microsoft.Extensions.Options;
using Pims.Api.Mapping.Converters;
using Pims.Dal.Helpers.Extensions;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
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
                .Map(dest => dest.WorkflowCode, src => src.Workflow.Code)
                .Map(dest => dest.Manager, src => src.Manager)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear)
                .Map(dest => dest.ActualFiscalYear, src => src.ActualFiscalYear)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => src.Agency.Name)
                .Map(dest => dest.AgencyCode, src => src.Agency.Code)
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgencyCode, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.Status, src => src.Status.Name)
                .Map(dest => dest.StatusCode, src => src.Status.Code)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.TierLevel, src => src.TierLevel.Name)
                .Map(dest => dest.Metadata, src => src.Metadata)
                .Map(dest => dest.SubmittedOn, src => src.SubmittedOn)
                .Map(dest => dest.ApprovedOn, src => src.ApprovedOn)
                .Map(dest => dest.DeniedOn, src => src.DeniedOn)
                .Map(dest => dest.CancelledOn, src => src.CancelledOn)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .Map(dest => dest.Note, src => src.GetNoteText(Entity.NoteTypes.General))
                .Map(dest => dest.PublicNote, src => src.GetNoteText(Entity.NoteTypes.Public))
                .Map(dest => dest.PrivateNote, src => src.GetNoteText(Entity.NoteTypes.Private))
                .Map(dest => dest.AppraisedNote, src => src.GetNoteText(Entity.NoteTypes.Appraisal))
                .Map(dest => dest.ExemptionRationale, src => src.GetNoteText(Entity.NoteTypes.Exemption))
                .Map(dest => dest.Notes, src => src.Notes)
                .Map(dest => dest.Responses, src => src.Responses)
                .AfterMapping((src, dest) =>
                {
                    var metadata = JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(src.Metadata ?? "{}", _serializerOptions);

                    dest.ExemptionRequested = metadata.ExemptionRequested;
                    dest.SalesCost = metadata.SalesCost;
                    dest.NetProceeds = metadata.NetProceeds;
                    dest.ProgramCost = metadata.ProgramCost;
                    dest.GainLoss = metadata.GainLoss;
                    dest.OcgFinancialStatement = metadata.OcgFinancialStatement;
                    dest.InterestComponent = metadata.InterestComponent;
                    dest.InitialNotificationSentOn = metadata.InitialNotificationSentOn;
                    dest.ThirtyDayNotificationSentOn = metadata.ThirtyDayNotificationSentOn;
                    dest.SixtyDayNotificationSentOn = metadata.SixtyDayNotificationSentOn;
                    dest.NinetyDayNotificationSentOn = metadata.NinetyDayNotificationSentOn;
                    dest.OnHoldNotificationSentOn = metadata.OnHoldNotificationSentOn;
                    dest.InterestedReceivedOn = metadata.InterestedReceivedOn;
                    dest.ClearanceNotificationSentOn = metadata.ClearanceNotificationSentOn;
                    dest.TransferredWithinGreOn = metadata.TransferredWithinGreOn;
                    dest.MarketedOn = metadata.MarketedOn;
                })
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
        #endregion
    }
}
