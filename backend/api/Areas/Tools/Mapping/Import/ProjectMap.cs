using Mapster;
using Newtonsoft.Json;
using Pims.Api.Mapping.Converters;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
    public class ProjectMap : IRegister
    {
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
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.TierLevel, src => src.TierLevel.Name)
                .Map(dest => dest.PublicNote, src => src.PublicNote)
                .Map(dest => dest.PrivateNote, src => src.PrivateNote)
                .Map(dest => dest.AppraisedNote, src => src.AppraisedNote)
                .Map(dest => dest.Metadata, src => src.Metadata)
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
                .Map(dest => dest.MarketedOn, src => src.MarketedOn)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
                .Map(dest => dest.ExemptionRequested, src => src.ExemptionRequested)
                .Map(dest => dest.ExemptionRationale, src => src.ExemptionRationale)
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
                .Map(dest => dest.Notes, src => src.Notes)
                .Map(dest => dest.Responses, src => src.Responses)
                .BeforeMapping((src, dest) => JsonConvert.PopulateObject(src.Metadata ?? "{}", src))
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}
