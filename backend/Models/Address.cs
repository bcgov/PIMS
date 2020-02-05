using System;

namespace Pims.Models
{
  /// <summary>
  /// provides a class to manage address.
  /// </summary>
  public class Address
  {
    #region Properties
    public string Line1 { get; set; }
    public string Line2 { get; set; }
    public string City {get; set;}
    public string Province {get; set;}
    public string Postal {get; set;}
    #endregion

    #region Constructors
    /// <summary>
    /// Create a new instance of a Address class.
    /// </summary>
    public Address() { }

    /// <summary>
    /// Create a new instance of a Address class.
    /// </summary>
    /// <param name="address"></param>
    public Address(Pims.Api.Data.Entities.Address address)
    {
      this.City = address.City?.Name;
      this.Line1 = address.Address1;
      this.Line2 = address.Address2;
      this.Postal = address.Postal;
      this.Province = address.Province?.Name;
    }
    #endregion
  }
}
