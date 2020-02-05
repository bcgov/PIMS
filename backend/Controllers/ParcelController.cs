using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Api.Data;
using Model = Pims.Api.Models;
using Entity = Pims.Api.Data.Entities;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing my parcels.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route ("/api/my/[controller]")]
    public class ParcelController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ParcelController> _logger;
        private readonly IConfiguration _configuration;
        private readonly PIMSContext _dbContext;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="dbContext"></param>
        public ParcelController (ILogger<ParcelController> logger, IConfiguration configuration, PIMSContext dbContext)
        {
            _logger = logger;
            _configuration = configuration;
            _dbContext = dbContext;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get all the parcels for the current user.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetMyParcels (double? neLat, double? neLong, double? swLat, double? swLong)
        {
            IEnumerable<Entity.Parcel> parcels = _dbContext.Parcels.ToArray();
            if(neLat != null && neLong != null && swLat != null && swLong != null) {
                parcels = parcels.Where(parcel => 
                    parcel.Latitude <= neLat 
                    && parcel.Latitude >= swLong
                    && parcel.Longitude <= neLong 
                    && parcel.Longitude >= swLong);
            }
            return new JsonResult (parcels.Select (p => new Model.Parcel (p)).ToArray ());
        }

        /// <summary>
        /// /// Get the parcel from the datasource if the user is allowed.
        /// </summary>
        /// <returns></returns>
        [HttpGet ("{id}")]
        public IActionResult GetMyParcels (int id)
        {
            var entity = _dbContext.Parcels.Find (id);
            if(entity == null) {
                return NotFound(); 
            }
            return new JsonResult (new Model.ParcelDetail (entity));
        }

        /// <summary>
        /// Add a new parcel to the datasource for the current user.
        /// /// </summary>
        /// <param name="parcel"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult AddMyParcels (Model.Parcel parcel)
        {
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var entity = new Entity.Parcel (parcel.Latitude, parcel.Longitude);
            _dbContext.Parcels.Add (entity);
            _dbContext.SaveChanges ();
            var result = new JsonResult (new Model.Parcel (entity));
            result.StatusCode = 201;
            return result;
        }

        /// <summary>
        /// Update the specified parcel in the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="parcel"></param>
        /// <returns></returns>
        [HttpPut ("{id}")]
        public IActionResult UpdateMyParcels (int id, Model.Parcel parcel)
        {
            // TODO: Concurrency.
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var entity = _dbContext.Parcels.Find (id);

            // Only admins can update other users parcels.
            if (!IsAllowed (entity))
            {
                return new UnauthorizedResult ();
            }

            entity.Latitude = parcel.Latitude;
            entity.Longitude = parcel.Longitude;
            entity.UpdatedById = userId;
            entity.UpdatedOn = DateTime.UtcNow;
            _dbContext.SaveChanges ();

            return new JsonResult (new Model.Parcel (entity));
        }

        /// <summary>
        /// Delete the specified parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete ("{id}")]
        public IActionResult DeleteMyParcels (int id)
        {
            // TODO: Concurrency.
            var entity = _dbContext.Parcels.Find (id);

            // Only admins can update other users parcels.
            if (!IsAllowed (entity))
            {
                return new UnauthorizedResult ();
            }

            _dbContext.Parcels.Remove (entity);
            _dbContext.SaveChanges ();

            return new JsonResult (new Model.Parcel (entity));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Validate that the current user is an administrator or this parcel belongs to them.
        /// </summary>
        /// <param name="parcel">The parcel to test.</param>
        /// <returns>True if the user is allowed.</returns>
        public bool IsAllowed (Entity.Parcel parcel)
        {
            var userId = new Guid (this.User.FindFirstValue (ClaimTypes.NameIdentifier));
            var isAdmin = this.User.Claims.Any (c => c.Type == ClaimTypes.Role && c.Value == "administrator");

            // Only admins can update other users parcels.
            return isAdmin || parcel?.CreatedById == userId;
        }
        #endregion
    }
}
