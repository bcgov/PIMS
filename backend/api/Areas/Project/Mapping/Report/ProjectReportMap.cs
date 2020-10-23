using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Report;

namespace Pims.Api.Areas.Project.Mapping.Report
{
    public class ProjectReportMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectReport, Model.ProjectReportModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.From, src => src.From)
                .Map(dest => dest.To, src => src.To)
                .Map(dest => dest.IsFinal, src => src.IsFinal)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.ReportTypeId, src => src.ReportTypeId)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectReportModel, Entity.ProjectReport>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.From, src => src.From)
                .Map(dest => dest.To, src => src.To)
                .Map(dest => dest.IsFinal, src => src.IsFinal)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.ReportTypeId, src => src.ReportTypeId)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
