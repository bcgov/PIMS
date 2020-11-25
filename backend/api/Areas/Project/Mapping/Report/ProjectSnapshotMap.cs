using Mapster;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Report;

namespace Pims.Api.Areas.Project.Mapping.Report
{
    public class ProjectSnapshotMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectSnapshotMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public ProjectSnapshotMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        #region Methods
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectSnapshot, Model.ProjectSnapshotModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.Project, src => src.Project)
                .Map(dest => dest.SnapshotOn, src => src.SnapshotOn)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .AfterMapping((src, dest) =>
                {
                    var metadata = JsonSerializer.Deserialize<Entity.Models.DisposalProjectSnapshotMetadata>(src.Metadata ?? "{}", _serializerOptions);
                    dest.SalesCost = metadata.SalesCost;
                    dest.NetProceeds = metadata.NetProceeds;
                    dest.BaselineIntegrity = metadata.BaselineIntegrity;
                    dest.ProgramCost = metadata.ProgramCost;
                    dest.GainLoss = metadata.GainLoss;
                    dest.OcgFinancialStatement = metadata.OcgFinancialStatement;
                    dest.SaleWithLeaseInPlace = metadata.SaleWithLeaseInPlace;
                    dest.InterestComponent = metadata.InterestComponent;
                })
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectSnapshotModel, Entity.ProjectSnapshot>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .AfterMapping((src, dest) =>
                {
                    var metadata = new Entity.Models.DisposalProjectSnapshotMetadata()
                    {
                        SalesCost = src.SalesCost,
                        NetProceeds = src.NetProceeds,
                        BaselineIntegrity = src.BaselineIntegrity,
                        ProgramCost = src.ProgramCost,
                        GainLoss = src.GainLoss,
                        OcgFinancialStatement = src.OcgFinancialStatement,
                        SaleWithLeaseInPlace = src.SaleWithLeaseInPlace,
                        InterestComponent = src.InterestComponent
                    };

                    dest.Metadata = JsonSerializer.Serialize(metadata, _serializerOptions);
                })
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
