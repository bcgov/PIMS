using Mapster;
using Pims.Api.Mapping.Converters;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Reports.Models.Project;

namespace Pims.Api.Areas.Reports.Mapping.Project
{
    public class ProjectMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Project, Model.ProjectModel>()
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear)
                .Map(dest => dest.ActualFiscalYear, src => src.ActualFiscalYear)
                .Map(dest => dest.StatusCode, src => src.Status == null ? null : src.Status.Code)
                .Map(dest => dest.Status, src => src.Status == null ? null : src.Status.Name)
                .Map(dest => dest.Risk, src => src.Risk.Name)
                .Map(dest => dest.TierLevel, src => src.TierLevel == null ? null : src.TierLevel.Name)
                .Map(dest => dest.AgencyCode, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.UpdatedOn, src => src.UpdatedOn)
                .Map(dest => dest.UpdatedBy,
                    src => src.UpdatedById != null ? src.UpdatedBy.DisplayName : null)
                .Map(dest => dest.CreatedOn, src => src.CreatedOn)
                .Map(dest => dest.CreatedBy,
                    src => src.CreatedById != null ? src.CreatedBy.DisplayName : null)

            #region Notes
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.PublicNote, src => src.PublicNote)
                .Map(dest => dest.PrivateNote, src => src.PrivateNote)
                .Map(dest => dest.AppraisedNote, src => src.AppraisedNote)
            #endregion

            #region Exemption
                .Map(dest => dest.ExemptionRequested, src => src.ExemptionRequested)
                .Map(dest => dest.ExemptionRationale, src => src.ExemptionRationale)
            #endregion

            #region Financial
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Estimated, src => src.Estimated)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .Map(dest => dest.SalesCost, src => src.SalesCost)
                .Map(dest => dest.NetProceeds, src => src.NetProceeds)
                .Map(dest => dest.ProgramCost, src => src.ProgramCost)
                .Map(dest => dest.GainLoss, src => src.GainLoss)
                .Map(dest => dest.OcgFinancialStatement, src => src.OcgFinancialStatement)
                .Map(dest => dest.InterestComponent, src => src.InterestComponent)
                .Map(dest => dest.OfferAmount, src => src.OfferAmount)
                .Map(dest => dest.SaleWithLeaseInPlace, src => src.SaleWithLeaseInPlace)
            #endregion

            #region Dates
                .Map(dest => dest.SubmittedOn, src => src.SubmittedOn)
                .Map(dest => dest.ApprovedOn, src => src.ApprovedOn)
                .Map(dest => dest.InitialNotificationSentOn, src => src.InitialNotificationSentOn)
                .Map(dest => dest.ThirtyDayNotificationSentOn, src => src.ThirtyDayNotificationSentOn)
                .Map(dest => dest.SixtyDayNotificationSentOn, src => src.SixtyDayNotificationSentOn)
                .Map(dest => dest.NinetyDayNotificationSentOn, src => src.NinetyDayNotificationSentOn)
                .Map(dest => dest.OnHoldNotificationSentOn, src => src.OnHoldNotificationSentOn)
                .Map(dest => dest.TransferredWithinGreOn, src => src.TransferredWithinGreOn)
                .Map(dest => dest.ClearanceNotificationSentOn, src => src.ClearanceNotificationSentOn)
                .Map(dest => dest.DeniedOn, src => src.DeniedOn)
                .Map(dest => dest.CancelledOn, src => src.CancelledOn)
                .Map(dest => dest.DisposedOn, src => src.DisposedOn)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
            #endregion

            #region SPL
                .Map(dest => dest.MarketedOn, src => src.MarketedOn)
                .Map(dest => dest.OffersNote, src => src.OffersNote)
                .Map(dest => dest.Purchaser, src => src.Purchaser)
                .Map(dest => dest.IsContractConditional, src => src.IsContractConditional);
            #endregion
        }
    }
}
