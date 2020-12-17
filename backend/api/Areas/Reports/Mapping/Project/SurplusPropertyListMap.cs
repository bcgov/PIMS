using Mapster;
using Microsoft.Extensions.Options;
using Pims.Api.Mapping.Converters;
using Pims.Core.Extensions;
using Pims.Dal.Helpers.Extensions;
using System.Linq;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Reports.Models.Project;

namespace Pims.Api.Areas.Reports.Mapping.Project
{
    public class SurplusPropertyListMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a SurplusPropertyListMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public SurplusPropertyListMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        #region Methods
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Project, Model.SurplusPropertyListModel>()
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear.FiscalYear())
                .Map(dest => dest.ActualFiscalYear, src => src.ActualFiscalYear.FiscalYear())
                .Map(dest => dest.MajorActivity, src => MajorActivity(src)) // TODO: Need valid list and determine if it can be changed.
                .Map(dest => dest.Status, src => SalesStatus(src)) // TODO: Need valid list and determine if it can be changed.
                .Map(dest => dest.AgencyCode, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.CurrentMarketValue, src => src.Market)
                .Map(dest => dest.NetBookValue, src => src.NetBook)
                .Map(dest => dest.Risk, src => src.Risk.Name)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
                .Map(dest => dest.ItemType, src => (string)null)
                .Map(dest => dest.Path, src => (string)null)
                .Map(dest => dest.Manager, src => src.Manager)
                .Map(dest => dest.ReportingNote, src => src.GetNoteText(Entity.NoteTypes.Reporting))
                .Map(dest => dest.FinancialNote, src => src.GetNoteText(Entity.NoteTypes.Financial))
                .Map(dest => dest.InterestFromEnhancedReferralNote, src => src.GetNoteText(Entity.NoteTypes.AgencyInterest))
                .AfterMapping((src, dest) =>
                 {
                     var metadata = JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(src.Metadata ?? "{}", _serializerOptions);
                     var priorSnapshot = src.Snapshots.Any() ? src.Snapshots.LastOrDefault() : null;
                     var prevMetadata = priorSnapshot != null ? JsonSerializer.Deserialize<Entity.Models.DisposalProjectSnapshotMetadata>(priorSnapshot.Metadata ?? "{}", _serializerOptions) : null;

                     dest.SalesCost = metadata.SalesCost;
                     dest.NetProceeds = metadata.NetProceeds;
                     dest.WeeklyIntegrityCheck = prevMetadata?.NetProceeds;
                     dest.BaselineIntegrityCheck = prevMetadata?.BaselineIntegrity;
                     dest.ProgramCost = metadata.ProgramCost;
                     dest.GainLoss = metadata.GainLoss;
                     dest.OcgFinancialStatement = metadata.OcgFinancialStatement;
                     dest.InterestComponent = metadata.InterestComponent;
                     dest.Slip = metadata.SaleWithLeaseInPlace;
                     dest.MarketedOn = metadata.MarketedOn;
                     dest.InterestedReceivedOn = metadata.InterestedReceivedOn;
                 });
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
                "SPL-CIP-C" => "Conditionally Sold",
                "SPL-CIP-U" => "Unconditionally Sold",
                "DIS" => "Complete",
                _ => project.Status.Name
            };
        }
        #endregion
    }
}
