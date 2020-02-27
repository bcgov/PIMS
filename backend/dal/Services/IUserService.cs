using System;
using System.Collections.Generic;
using System.Text;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /**
     * Dal adapter for the User Controller.
     */
    public interface IUserService
    {
        public IEnumerable<User> GetUsers(int page, int quantity, string sort);
        public User GetUser(Guid id);
        public User AddUser(User user);
        public User UpdateUser(User user);
        public User DeleteUser(User user);
    }
}
