using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendApi.Data;
using Property = BackendApi.Models.Property;
using PropertyDetail = BackendApi.Models.PropertyDetail;
using Entity = BackendApi.Data.Entities;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BackendApi.Controllers
{
  /// <summary>
  /// Provides endpoints for managing properties
  /// </summary>
  [Authorize]
  [ApiController]
  [Route("/api/[controller]")]
  public class PropertiesController : ControllerBase
  {
    #region Variables
    private readonly ILogger<PropertiesController> _logger;
    private readonly IConfiguration _configuration;
    private readonly GeoSpatialContext _dbContext;
    #endregion



    #region Constructors
    /// <summary>
    /// Creates a new instance of a PropertiesController class.
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="configuration"></param>
    /// <param name="dbContext"></param>
    public PropertiesController(ILogger<PropertiesController> logger, IConfiguration configuration, GeoSpatialContext dbContext)
    {
      _logger = logger;
      _configuration = configuration;
      _dbContext = dbContext;
    }
    #endregion

    #region Endpoints

    /// <summary>
    /// Get a list of properties that are within the provided bounds
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult GetProperties(double? neLat, double? neLong, double? swLat, double? swLong)
    {
      //return a mock response for now.
      Property property = new Property
      {
        Pid = 123,
        Pin = 321,
        Lat = 48.4256574,
        Lng = -123.3647248,
        Address = "1207 Douglas st."
      };

      Property propertyTwo = new Property
      {
        Pid = 321,
        Pin = 123,
        Lat = 48.4256574,
        Lng = -123.3647248,
        Address = "1207 Douglas st."
      };

      Property[] properties = new Property[] {property, propertyTwo};

      return new JsonResult(properties);
    }

    /// <summary>
    /// Get the details for a specified property
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Route ("/api/properties/{pid}")]
    public IActionResult GetPropertyDetails(double pid)
    {
      //return a mock response for now.
      PropertyDetail propertyDetail = new PropertyDetail
      {
        Pid = 123,
        Name = "Butchart Gardens",
        PropertyDetail1 = "costs $10,000,000",
        PropertyDetail2 = "not for sale"
      };

      return new JsonResult(propertyDetail);
    }
    #endregion
  }
}
