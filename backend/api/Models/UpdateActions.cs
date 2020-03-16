namespace Pims.Api.Models
{
    /// <summary>
    /// UpdateActions enum, provides a way to identify what action to perform on a given object.
    /// </summary>
    public enum UpdateActions
    {
        /// <summary>
        /// Take no action for this object.
        /// </summary>
        NoAction = 0,
        /// <summary>
        /// Create a new object in the datasource.
        /// </summary>
        Create = 1,
        /// <summary>
        /// Update an existing object in the datasource.
        /// </summary>
        Update = 2,
        /// <summary>
        /// Delete an existing object in the datasource.
        /// </summary>
        Delete = 3,
        /// <summary>
        /// Add a reference to an existing object in the datasource.
        /// </summary>
        Add = 4,
        /// <summary>
        /// Remove a reference to an existing object in the datasource.
        /// </summary>
        Remove = 5
    }
}
