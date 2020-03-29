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
        public UserModel(Guid id)
        {
            this.Id = id;
        }

        /// <summary>
        /// Creates a new instance of a UserModel object, initializes it with specified arguments.
        /// </summary>
        /// <param name="user"></param>
        public UserModel(Entity.User user)
        {
            this.Id = user.Id;
        }
        #endregion
    }
}
