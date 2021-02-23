using Mapster;
using System;
using System.Linq;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Reports.Models.User;

namespace Pims.Api.Areas.Reports.Mapping.User
{
    public class UserMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.User, Model.UserModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.Username, src => src.Username)
                .Map(dest => dest.Position, src => src.Position)
                .Map(dest => dest.DisplayName, src => src.DisplayName)
                .Map(dest => dest.FirstName, src => src.FirstName)
                .Map(dest => dest.MiddleName, src => src.MiddleName)
                .Map(dest => dest.LastName, src => src.LastName)
                .Map(dest => dest.Email, src => src.Email)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.Agencies, src => String.Join(",", src.Agencies.Select(a => a.Agency.Name)))
                .Map(dest => dest.Roles, src => String.Join(",", src.Roles.Select(a => a.Role.Name)))
                .Map(dest => dest.LastLogin, src => src.LastLogin)
                .Map(dest => dest.ApprovedBy, src => src.ApprovedBy != null ? src.ApprovedBy.DisplayName : null)
                .Map(dest => dest.ApprovedOn, src => src.ApprovedOn)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}
