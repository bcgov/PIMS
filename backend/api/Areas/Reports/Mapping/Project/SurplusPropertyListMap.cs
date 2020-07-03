using Mapster;
using Model = Pims.Api.Areas.Reports.Models.Project;
using Entity = Pims.Dal.Entities;
using Pims.Api.Mapping.Converters;
using System.Linq;
using Pims.Core.Extensions;

namespace Pims.Api.Areas.Reports.Mapping.Project
{
    public class SurplusPropertyListMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Project, Model.SurplusPropertyListModel>()
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.ActualFiscalYear, src => src.ActualFiscalYear.FiscalYear())
                .Map(dest => dest.MajorActivity, src => MajorActivity(src)) // TODO: Need valid list and determine if it can be changed.
                .Map(dest => dest.Status, src => SalesStatus(src)) // TODO: Need valid list and determine if it can be changed.
                .Map(dest => dest.AgencyCode, src => AgencyConverter.ConvertAgency(src.Agency)) // TODO: Should the child agency be shown here?
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.CurrentMarketValue, src => src.Assessed) // TODO: Is this Assessed or Appraised if provided?
                .Map(dest => dest.NetBookValue, src => src.NetBook)
                .Map(dest => dest.SalesCost, src => src.SalesCost)
                .Map(dest => dest.NetProceeds, src => src.NetProceeds)
                .Map(dest => dest.BaselineIntegrityCheck, src => 0) // TODO: Need formula.
                .Map(dest => dest.StatusColour, src => StatusColour(src))
                .Map(dest => dest.MarketedOn, src => src.MarketedOn)
                .Map(dest => dest.DisposedOn, src => src.DisposedOn)
                .Map(dest => dest.PrivateNote, src => src.PrivateNote)
                .Map(dest => dest.ItemType, src => (string)null) // TODO: What is this?
                .Map(dest => dest.Path, src => (string)null) // TODO: What is this?
                .Map(dest => dest.WeeklyIntegrityCheck, src => 0) // TODO: Need formula.
                .Map(dest => dest.ProgramCost, src => src.ProgramCost)
                .Map(dest => dest.GainLoss, src => src.GainLoss)
                .Map(dest => dest.OcgFinalStatement, src => src.OcgFinalStatement)
                .Map(dest => dest.InterestComponent, src => src.InterestComponent)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear.FiscalYear())
                .Map(dest => dest.Manager, src => src.Manager) // TODO: Form doesn't have a place to enter this value.
                .Map(dest => dest.Slip, src => (string)null) // TODO: What is this?
                .Map(dest => dest.FinancialNote, src => src.Notes.LastOrDefault(n => n.NoteType == Entity.NoteTypes.Financial))  // TODO: Not ideal to return all notes, but other options will require far too much effort.
                .Map(dest => dest.AgencyResponseNote, src => src.AgencyResponseNote);
                //.Map(dest => dest.AgencyResponseDate, src => src.InterestReceivedOn); // TODO: Form doesn't have a place to enter this value.
        }

        private string MajorActivity(Entity.Project project)
        {
            return project.Status.Code switch
            {
                "SPL-DIS" => "Completed Deal",
                _ => project.Status.Name
            };
        }

        private string SalesStatus(Entity.Project project)
        {
            return project.Status.Code switch
            {
                "SPL-CIP" => "Conditionally Sold", // "Unconditionally Sold" // TODO: Need to link to contracts
                "SPL-DIS" => "Complete", // "Complete - Adjustment to Prior Year // TODO: Not sure what this means
                _ => project.Status.Name
            };
        }

        private string StatusColour(Entity.Project project) // TODO: Need to know how to determine the status.
        {
            return project.Status.Code switch
            {
                _ => "red"
            };
        }
    }
}
