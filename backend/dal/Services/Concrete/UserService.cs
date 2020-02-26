using System;
using System.Data.SqlClient;
using Pims.Dal.Entities;
using System.Security.Claims;
using Pims.Dal.Helpers.Extensions;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Pims.Dal.Services.Concrete
{
    /**
     * EF Core implementation of user service
     */
    public class UserService : IUserService
    {
        private readonly PIMSContext _dbContext;
        private readonly ClaimsPrincipal _user;
        public UserService(PIMSContext dbContext, ClaimsPrincipal user)
        {
            _dbContext = dbContext;
            _user = user;
        }

        public IEnumerable<User> GetUsers()
        {
            var query = _dbContext.Users.AsNoTracking();
            return query.ToArray();
        }

        public User GetUser(Guid id)
        {
            return _dbContext.Users.AsNoTracking().FirstOrDefault(u => u.Id == id);
        }

        public User AddUser(User entity)
        {
            if (entity == null) throw new ArgumentNullException();
            var userId = this._user.GetUserId();
            entity.CreatedById = userId;
            _dbContext.Users.Add(entity);
            _dbContext.CommitTransaction();
            return entity;
        }

        public User UpdateUser(User entity)
        {
            if (entity == null) throw new ArgumentNullException();
            var entityToUpdate = _dbContext.Users.Find(entity.Id);

            if (entity == null) throw new KeyNotFoundException();
            var userId = this._user.GetUserId();

            entity.UpdatedOn = DateTime.UtcNow;
            entity.UpdatedById = userId;
            _dbContext.Entry(entityToUpdate).CurrentValues.SetValues(entity);
            _dbContext.Users.Update(entity);
            _dbContext.CommitTransaction();
            return entityToUpdate;
        }

        public User DeleteUser(User user)
        {
            if (user == null) throw new ArgumentNullException();
            var entityToDelete = _dbContext.Users.Find(user.Id);

            if (entityToDelete == null) return null;

            entityToDelete.RowVersion = user.RowVersion.ToArray();
            _dbContext.Users.Remove(entityToDelete);
            _dbContext.CommitTransaction();
            return entityToDelete;
        }
    }
}
