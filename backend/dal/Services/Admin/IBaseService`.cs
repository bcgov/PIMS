using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBaseService interface, provides a service layer for basic CRUD actions with the datasource.
    ///</summary>
    /// <typeparam name="ET"></typeparam>
    public interface IBaseService<ET> : IService
        where ET : BaseEntity
    {
        #region Methods
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
        void Add(ET entity);

        /// <summary>
        /// Add the specified entity to the in-memory collection but do not commit to the datasource.
        /// </summary>
        ///<param name="entity"></param>
        /// <returns></returns>
        void AddOne(ET entity);

        /// <summary>
        /// Update the specified entity in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        void Update(ET entity);

        /// <summary>
        /// Update the specified entity to the in-memory collection but do not commit to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        void UpdateOne(ET entity);

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
