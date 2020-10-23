using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Report;

namespace Pims.Api.Areas.Project.Mapping.Report
{
    public class ProjectSnapshotMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectSnapshot, Model.ProjectSnapshotModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.Project, src => src.Project)
                .Map(dest => dest.SnapshotOn, src => src.SnapshotOn)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Estimated, src => src.Estimated)
                .Map(dest => dest.SalesCost, src => src.SalesCost)
                .Map(dest => dest.NetProceeds, src => src.NetProceeds)
                .Map(dest => dest.BaselineIntegrity, src => src.BaselineIntegrity)
                .Map(dest => dest.ProgramCost, src => src.ProgramCost)
                .Map(dest => dest.GainLoss, src => src.GainLoss)
                .Map(dest => dest.OcgFinancialStatement, src => src.OcgFinancialStatement)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .Map(dest => dest.SaleWithLeaseInPlace, src => src.SaleWithLeaseInPlace)
                .Map(dest => dest.InterestComponent, src => src.InterestComponent)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectSnapshotModel, Entity.ProjectSnapshot>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Estimated, src => src.Estimated)
                .Map(dest => dest.SalesCost, src => src.SalesCost)
                .Map(dest => dest.NetProceeds, src => src.NetProceeds)
                .Map(dest => dest.ProgramCost, src => src.ProgramCost)
                .Map(dest => dest.GainLoss, src => src.GainLoss)
                .Map(dest => dest.OcgFinancialStatement, src => src.OcgFinancialStatement)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Appraised, src => src.Appraised)
                .Map(dest => dest.SaleWithLeaseInPlace, src => src.SaleWithLeaseInPlace)
                .Map(dest => dest.InterestComponent, src => src.InterestComponent)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
