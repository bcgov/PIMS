using Pims.Dal;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Models.User
{
    /// <summary>
    /// AccessRequestNotificationModel class, provides a model that is used to generate access request notifications.
    /// </summary>
    public class AccessRequestNotificationModel
    {
        #region Properties
        /// <summary>
        /// get/ste - The access request.
        /// </summary>
        public Entity.AccessRequest AccessRequest { get; set; }

        /// <summary>
        /// get/set - Environment configuration settings.
        /// </summary>
        public Entity.Models.EnvironmentModel Environment { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an AccessRequestNotificationModel.
        /// </summary>
        public AccessRequestNotificationModel() { }

        /// <summary>
        /// Creates a new instance of an AccessRequestNotificationModel, initializes it with specified arguments.
        /// </summary>
        /// <param name="accessRequest"></param>
        /// <param name="env"></param>
        public AccessRequestNotificationModel(Entity.AccessRequest accessRequest, Entity.Models.EnvironmentModel env)
        {
            this.AccessRequest = accessRequest;
            this.Environment = env;
        }

        /// <summary>
        /// Creates a new instance of an AccessRequestNotificationModel, initializes it with specified arguments.
        /// </summary>
        /// <param name="accessRequest"></param>
        /// <param name="options"></param>
        public AccessRequestNotificationModel(Entity.AccessRequest accessRequest, PimsOptions options)
        {
            this.AccessRequest = accessRequest;
            this.Environment = new Entity.Models.EnvironmentModel(options.Environment.Uri, options.Environment.Name, options.Environment.Title);
        }
        #endregion
    }
}
