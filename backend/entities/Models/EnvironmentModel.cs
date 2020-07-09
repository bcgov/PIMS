using System;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// EnvironmentModel class, provides a model that is used to generate notifications.
    /// </summary>
    public class EnvironmentModel
    {
        #region Properties
        /// <summary>
        /// get/set - The application URI.
        /// </summary>
        public Uri Uri { get; set; }

        /// <summary>
        /// get/set - The environment name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The application title.
        /// </summary>
        public string Title { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a EnvironmentModel.
        /// </summary>
        public EnvironmentModel() { }

        /// <summary>
        /// Creates a new instance of a EnvironmentModel, initialize with specified arguments.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="name"></param>
        /// <param name="title"></param>
        public EnvironmentModel(Uri uri, string name, string title)
        {
            this.Uri = uri;
            this.Name = name;
            this.Title = title;
        }
        #endregion
    }
}
