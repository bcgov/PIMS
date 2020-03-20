using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBaseService interface, provides a service layer for basic CRUD actions with the datasource.
    ///</summary>
    /// <typeparam name="ET"></typeparam>
    public interface IBaseService<ET> where ET : BaseEntity
    {
        #region Methods
        /// <summary>
        /// Copies the values from the 'source' into the 'destination' so that EF can update appropriately.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        void SetCurrentValues(ET source, ET destination);

        /// <summary>
        /// Find the entity with the specified key in the datasource.
        ///</summary>
        /// <param name="keyValues"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        ET Find(params object[] keyValues);

        /// <summary>
        /// Add the specified entity to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        ET Add(ET entity);

        /// <summary>
        /// Add the specified entity to the in-memory collection but do not commit to the datasource.
        /// </summary>
        ///<param name="entity"></param>
        /// <returns></returns>
        ET AddOne(ET entity);

        /// <summary>
        /// Update the specified entity in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        ET Update(ET entity);

        /// <summary>
        /// Update the specified entity to the in-memory collection but do not commit to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        ET UpdateOne(ET entity);

        /// <summary>
        /// Remove the specified entity from the datasource.
        ///</summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        void Remove(ET entity);

        /// <summary>
        /// Remove the specified entity from the in-memory collection but do not commit to the datasource.
        ///</summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        void RemoveOne(ET entity);
        #endregion
    }
}
