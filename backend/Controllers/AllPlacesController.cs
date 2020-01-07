using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Model = BackendApi.Models;
using Entity = BackendApi.Data.Entities;
using System.Security.Claims;
using BackendApi.Data;

namespace BackendApi.Controllers
{
    /// <summary>
    /// AllPlacesController class, provides endpoints to manage all places in the datasource.
    /// </summary>
    /// [Authorize (Roles = "administrator")]
    [ApiController]
    [Route ("/api/all/places")]
    public class AllPlacesController : ControllerBase
    {
        #region Variables
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;
        private readonly GeoSpatialContext _dbContext;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AllPlacesController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="dbContext"></param>
        public AllPlacesController (ILogger<AuthController> logger, IConfiguration configuration, GeoSpatialContext dbContext)
        {
            _logger = logger;
            _configuration = configuration;
            _dbContext = dbContext;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Returns all places in the datasource, or filters them by user ID.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult AllPlaces (Guid? userId)
        {
            var query = _dbContext.Places.Where (p => true);
            if (userId != null)
            {
                query = query.Where (p => p.OwnerId == userId);
            }
            return new JsonResult (query.Select (p => new Model.Place (p)).ToArray ());
        }
        #endregion
    }
}
