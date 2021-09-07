using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Models.Auth
{
    /// <summary>
    /// UserModel class, provides a model to represent a user.
    /// </summary>
    public class UserModel
    {
        #region Properties
        /// <summary>
        /// get/set - The user id.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The user's keycloak id.
        /// </summary>
        public Guid? KeycloakUserId { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserModel object.
        /// </summary>
        public UserModel() { }

        /// <summary>
        /// Creates a new instance of a UserModel object, initializes it with specified arguments.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="keycloakUserId"></param>
        public UserModel(Guid id, Guid? keycloakUserId)
        {
            this.Id = id;
            this.KeycloakUserId = keycloakUserId;
        }

        /// <summary>
        /// Creates a new instance of a UserModel object, initializes it with specified arguments.
        /// </summary>
        /// <param name="user"></param>
        public UserModel(Entity.User user)
        {
            this.Id = user.Id;
            this.KeycloakUserId = user.KeycloakUserId;
        }
        #endregion
    }
}
