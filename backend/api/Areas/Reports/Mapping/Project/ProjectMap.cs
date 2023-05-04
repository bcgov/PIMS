using Mapster;
using Microsoft.Extensions.Options;
using Pims.Dal.Helpers.Extensions;
using Pims.Core.Extensions;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Reports.Models.Project;

namespace Pims.Api.Areas.Reports.Mapping.Project
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
            config.NewConfig<Entity.Project, Model.ProjectModelExcel>()
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Location, src => src.GetPropertyLocation())
                .Map(dest => dest.PID, src => src.GetParcelPIDs())
                .Map(dest => dest.LotSize, src => src.GetParcelLotsize())
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ReportedFiscalYearString, src => src.ReportedFiscalYear.FiscalYear())
                .Map(dest => dest.ActualFiscalYearString, src => src.ActualFiscalYear.FiscalYear())
                .Map(dest => dest.StatusCode, src => src.Status == null ? null : src.Status.Code)
                .Map(dest => dest.Status, src => src.Status == null ? null : src.Status.Name)
                .Map(dest => dest.Risk, src => src.Risk.Name)
                .Map(dest => dest.TierLevel, src => src.TierLevel == null ? null : src.TierLevel.Name)
                .Map(dest => dest.Ministry, src => src.Agency.ParentId.HasValue ? src.Agency.Parent.Code : src.Agency.Code)
                .Map(dest => dest.Agency, src => src.Agency.Name)
                .Map(dest => dest.UpdatedOn, src => src.UpdatedOn)
                .Map(dest => dest.UpdatedBy,
                    src => src.UpdatedById != null ? src.UpdatedBy.DisplayName : null)
                .Map(dest => dest.CreatedOn, src => src.CreatedOn)
                .Map(dest => dest.CreatedBy,
                    src => src.CreatedById != null ? src.CreatedBy.DisplayName : null)

            #region Notes
                .Map(dest => dest.Note, src => src.GetNoteText(Entity.NoteTypes.General))
                .Map(dest => dest.PublicNote, src => src.GetNoteText(Entity.NoteTypes.Public))
                .Map(dest => dest.PrivateNote, src => src.GetNoteText(Entity.NoteTypes.Private))
                .Map(dest => dest.AppraisedNote, src => src.GetNoteText(Entity.NoteTypes.Appraisal))
                .Map(dest => dest.ExemptionRationale, src => src.GetNoteText(Entity.NoteTypes.Exemption))
                .Map(dest => dest.OffersNote, src => src.GetNoteText(Entity.NoteTypes.Offer))
            #endregion

            #region Financial
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
            #endregion

            #region Dates
                .Map(dest => dest.SubmittedOn, src => src.SubmittedOn)
                .Map(dest => dest.ApprovedOn, src => src.ApprovedOn)
                .Map(dest => dest.DeniedOn, src => src.DeniedOn)
                .Map(dest => dest.CancelledOn, src => src.CancelledOn)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
            #endregion

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
                    dest.OfferAmount = metadata.OfferAmount;
                    dest.SaleWithLeaseInPlace = metadata.SaleWithLeaseInPlace;
                    dest.InitialNotificationSentOn = metadata.InitialNotificationSentOn;
                    dest.ThirtyDayNotificationSentOn = metadata.ThirtyDayNotificationSentOn;
                    dest.SixtyDayNotificationSentOn = metadata.SixtyDayNotificationSentOn;
                    dest.NinetyDayNotificationSentOn = metadata.NinetyDayNotificationSentOn;
                    dest.OnHoldNotificationSentOn = metadata.OnHoldNotificationSentOn;
                    dest.TransferredWithinGreOn = metadata.TransferredWithinGreOn;
                    dest.ClearanceNotificationSentOn = metadata.ClearanceNotificationSentOn;
                    dest.DisposedOn = metadata.DisposedOn;
                    dest.MarketedOn = metadata.MarketedOn;
                    dest.Purchaser = metadata.Purchaser;
                });
        }
        #endregion
    }
}
