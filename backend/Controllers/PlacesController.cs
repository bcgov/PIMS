using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendApi.Data;
using Model = BackendApi.Models;
using Entity = BackendApi.Data.Entities;
using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BackendApi.Controllers
{
    /// <summary>
    /// PlacesController class, provides endpoints for managing my places.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route ("/api/my/[controller]")]
    public class PlacesController : ControllerBase
    {
        #region Variables
        private readonly ILogger<PlacesController> _logger;
        private readonly IConfiguration _configuration;
        private readonly GeoSpatialContext _dbContext;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PlacesController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="dbContext"></param>
        public PlacesController (ILogger<PlacesController> logger, IConfiguration configuration, GeoSpatialContext dbContext)
        {
            _logger = logger;
            _configuration = configuration;
            _dbContext = dbContext;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get all the places for the current user.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetMyPlaces ()
        {
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var places = _dbContext.Places.Where (p => p.OwnerId == userId);
            return new JsonResult (places.Select (p => new Model.Place (p)).ToArray ());
        }

        /// <summary>
        /// Get the place from the datasource if the user is allowed.
        /// </summary>
        /// <returns></returns>
        [HttpGet ("{id}")]
        public IActionResult GetMyPlaces (int id)
        {
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var entity = _dbContext.Places.Find (id);

            // Only admins can update other users places.
            if (!IsAllowed (entity))
            {
                return new UnauthorizedResult ();
            }

            return new JsonResult (new Model.Place (entity));
        }

        /// <summary>
        /// Add a new place to the datasource for the current user.
        /// </summary>
        /// <param name="place"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult AddMyPlaces (Model.Place place)
        {
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var entity = new Entity.Place (place.Latitude, place.Longitude, place.Note, userId);
            _dbContext.Places.Add (entity);
            _dbContext.SaveChanges ();
            var result = new JsonResult (new Model.Place (entity));
            result.StatusCode = 201;
            return result;
        }

        /// <summary>
        /// Update the specified place in the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="place"></param>
        /// <returns></returns>
        [HttpPut ("{id}")]
        public IActionResult UpdateMyPlaces (int id, Model.Place place)
        {
            // TODO: Concurrency.
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var entity = _dbContext.Places.Find (id);

            // Only admins can update other users places.
            if (!IsAllowed (entity))
            {
                return new UnauthorizedResult ();
            }

            entity.Lat = place.Latitude;
            entity.Lng = place.Longitude;
            entity.Note = place.Note;
            entity.UpdatedById = userId;
            entity.UpdatedOn = DateTime.UtcNow;
            _dbContext.SaveChanges ();

            return new JsonResult (new Model.Place (entity));
        }

        /// <summary>
        /// Delete the specified place from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete ("{id}")]
        public IActionResult DeleteMyPlaces (int id)
        {
            // TODO: Concurrency.
            var entity = _dbContext.Places.Find (id);

            // Only admins can update other users places.
            if (!IsAllowed (entity))
            {
                return new UnauthorizedResult ();
            }

            _dbContext.Places.Remove (entity);
            _dbContext.SaveChanges ();

            return new JsonResult (new Model.Place (entity));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Validate that the current user is an administrator or this place belongs to them.
        /// </summary>
        /// <param name="place">The place to test.</param>
        /// <returns>True if the user is allowed.</returns>
        public bool IsAllowed (Entity.Place place)
        {
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var isAdmin = this.User.Claims.Any (c => c.Type == ClaimTypes.Role && c.Value == "administrator");

            // Only admins can update other users places.
            return isAdmin || place?.OwnerId == userId;
        }
        #endregion
    }
}
