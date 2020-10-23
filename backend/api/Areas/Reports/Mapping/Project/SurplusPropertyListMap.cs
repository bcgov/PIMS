using Mapster;
using Newtonsoft.Json;
using Pims.Api.Mapping.Converters;
using Pims.Core.Extensions;
using System.Linq;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Reports.Models.Project;

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
                .Map(dest => dest.AgencyCode, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.CurrentMarketValue, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().Estimated : src.Estimated)
                .Map(dest => dest.NetBookValue, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().NetBook : src.NetBook)
                .Map(dest => dest.SalesCost, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().SalesCost : src.SalesCost)
                .Map(dest => dest.NetProceeds, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().NetProceeds : src.NetProceeds)
                .Map(dest => dest.BaselineIntegrityCheck, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().BaselineIntegrity : src.BaselineIntegrity)
                .Map(dest => dest.Risk, src => src.Risk.Name)
                .Map(dest => dest.MarketedOn, src => src.MarketedOn)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
                .Map(dest => dest.PrivateNote, src => src.PrivateNote)
                .Map(dest => dest.ItemType, src => (string)null)
                .Map(dest => dest.Path, src => (string)null)
                .Map(dest => dest.WeeklyIntegrityCheck, src => (decimal?)null) // TODO: Link to ProjectSnapshots.
                .Map(dest => dest.ProgramCost, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().ProgramCost : src.ProgramCost)
                .Map(dest => dest.GainLoss, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().GainLoss : src.GainLoss)
                .Map(dest => dest.OcgFinancialStatement, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().OcgFinancialStatement : src.OcgFinancialStatement)
                .Map(dest => dest.InterestComponent, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().InterestComponent : src.InterestComponent)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear.FiscalYear())
                .Map(dest => dest.Manager, src => src.Manager)
                .Map(dest => dest.Slip, src => src.Snapshots.Any() ? src.Snapshots.FirstOrDefault().SaleWithLeaseInPlace : src.SaleWithLeaseInPlace)
                .Map(dest => dest.FinancialNote, src => src.Notes.LastOrDefault(n => n.NoteType == Entity.NoteTypes.Financial))  // TODO: Not ideal to return all notes, but other options will require far too much effort.
                .BeforeMapping((src, dest) => JsonConvert.PopulateObject(src.Metadata ?? "{}", src));
            //.Map(dest => dest.AgencyResponseDate, src => src.InterestReceivedOn); // TODO: Form doesn't have a place to enter this value.
        }

        private string MajorActivity(Entity.Project project)
        {
            return project.Status.Code switch
            {
                "DIS" => "Complete",
                "SPL-PM" => "Pre-Marketing",
                "SPL-M" => "On the Market",
                "PSL-CIP" => "Contract in Place",
                _ => project.Status.Name
            };
        }

        private string SalesStatus(Entity.Project project)
        {
            return project.Status.Code switch
            {
                "SPL-CIP" => "Conditionally Sold", // "Unconditionally Sold" // TODO: Need to link to contracts
                "DIS" => "Complete", // "Complete - Adjustment to Prior Year // TODO: Not sure what this means
                _ => project.Status.Name
            };
        }
    }
}
