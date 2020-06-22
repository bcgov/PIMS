using System;
using Mapster;
using Model = Pims.Api.Areas.Keycloak.Models.User;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using System.Linq;

namespace Pims.Api.Areas.Keycloak.Mapping.User
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
                .Map(dest => dest.Agencies, src => src.Agencies)
                .Map(dest => dest.Roles, src => src.Roles.Select(r => r.Role))
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.UserModel, Entity.User>()
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
                .Map(dest => dest.Agencies, src => src.Agencies)
                .Map(dest => dest.Roles, src => src.Roles)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();


            config.NewConfig<Entity.User, KModel.UserModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Username, src => src.Username)
                .Map(dest => dest.FirstName, src => src.FirstName)
                .Map(dest => dest.LastName, src => src.LastName)
                .Map(dest => dest.Email, src => src.Email)
                .Map(dest => dest.Enabled, src => !src.IsDisabled)
                .Inherits<Entity.BaseEntity, Object>();

            config.NewConfig<Entity.User, Entity.User>()
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
                .Inherits<Entity.BaseEntity, Entity.BaseEntity>();
        }
    }
}
