using System;
using System.Linq;
using System.Net.Http;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Pims.Api.Data;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;
using Pims.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Pims.Api.Helpers.Extensions;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing parcels.
    /// </summary>
    // [Authorize (Roles = "administrator")]
    [ApiController]
    [Area("admin")]
    [Route("/api/[area]/[controller]")]
    public class ParcelController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ParcelController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;
        private readonly PIMSContext _dbContext;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="clientFactory"></param>
        /// <param name="dbContext"></param>
        /// <param name="mapper"></param>
        public ParcelController(ILogger<ParcelController> logger, IConfiguration configuration, IHttpClientFactory clientFactory, PIMSContext dbContext, IMapper mapper)
        {
            _logger = logger;
            _configuration = configuration;
            _clientFactory = clientFactory;
            _dbContext = dbContext;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// GET - Returns a paged array of parcels from the datasource.
        /// </summary>
        /// <returns>Paged object with an array of parcels.</returns>
        [HttpGet("/api/admin/parcels")]
        public IActionResult GetParcels(int page = 1, int quantity = 10, string sort = null) // TODO: sort and filter.
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 50) quantity = 50;

            var query = _dbContext.Parcels
                .AsNoTracking();
            var total = query.Count();
            var entities = query.Skip((page - 1) * quantity).Take(quantity);
            var parcels = _mapper.Map<Model.Parts.ParcelModel[]>(entities);
            var paged = new Paged<Model.Parts.ParcelModel>(parcels, page, quantity, total);
            return new JsonResult(paged);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("{id:int}")]
        public IActionResult GetParcel(int id)
        {
            var entity = _dbContext.Parcels
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking().SingleOrDefault(u => u.Id == id);

            if (entity == null) return NoContent();

            var parcel = _mapper.Map<Model.ParcelModel>(entity);
            return new JsonResult(parcel);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="pid">The unique 'PID' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("pid/{pid:int}")]
        public IActionResult GetParcelByPID(int pid)
        {
            var entity = _dbContext.Parcels
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking().SingleOrDefault(u => u.ParcelId == pid);

            if (entity == null) return NoContent();

            var parcel = _mapper.Map<Model.ParcelModel>(entity);
            return new JsonResult(parcel);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="pid">The unique 'PID' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("pid/{pid}")]
        public IActionResult GetParcelByPID(string pid)
        {
            if (!int.TryParse(pid.Replace("-", ""), out int id))
                return BadRequest("PID is invalid");

            var entity = _dbContext.Parcels
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking().SingleOrDefault(u => u.ParcelId == id);

            if (entity == null) return NoContent();

            var parcel = _mapper.Map<Model.ParcelModel>(entity);
            return new JsonResult(parcel);
        }

        /// <summary>
        /// POST - Add a new parcel to the datasource.
        /// </summary>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel added.</returns>
        [HttpPost]
        public IActionResult AddParcel([FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model); // TODO: Return bad request.
            var userId = this.User.GetUserId();
            entity.CreatedById = userId;
            _dbContext.Parcels.Add(entity);
            _dbContext.CommitTransaction();
            var parcel = _mapper.Map<Model.ParcelModel>(entity);
            return new JsonResult(parcel);
        }

        /// <summary>
        /// PUT - Update the parcel in the datasource.
        /// </summary>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel updated.</returns>
        [HttpPut]
        public IActionResult UpdateParcel([FromBody] Model.ParcelModel model)
        {
            var entity = _dbContext.Parcels.Find(model.Id);

            if (entity == null) return BadRequest("Item does not exist");
            var userId = this.User.GetUserId();

            _mapper.Map(model, entity);
            entity.UpdatedById = userId;
            entity.UpdatedOn = DateTime.UtcNow;
            _dbContext.Parcels.Update(entity);
            _dbContext.CommitTransaction();
            var parcel = _mapper.Map<Model.ParcelModel>(entity);
            return new JsonResult(parcel);
        }

        /// <summary>
        /// DELETE - Delete the parcel from the datasource.
        /// </summary>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel who was deleted.</returns>
        [HttpDelete("{id}")]
        public IActionResult DeleteParcel(int id, [FromBody] Model.ParcelModel model)
        {
            var entity = _dbContext.Parcels.Find(id);

            if (entity == null) return BadRequest("Item does not exist");

            entity.RowVersion = Convert.FromBase64String(model.RowVersion);
            _dbContext.Parcels.Remove(entity);
            _dbContext.CommitTransaction();
            return new JsonResult(model);
        }
        #endregion
    }
}
