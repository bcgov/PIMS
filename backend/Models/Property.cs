using System;

namespace BackendApi.Models
{
  /// <summary>
  /// Property class with minimal property information
  /// /// </summary>
  public class Property
  {
    #region Properties

    public double Pid { get; set; }
    public double Pin { get; set; }
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string Address { get; set; }
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of a Property class.
    /// </summary>
    public Property() { }

    /// <summary>
    /// Creates a new instance of a Property class.
    /// </summary>
    /// <param name="pid"></param>
    /// <param name="pin"></param>
    /// <param name="lat"></param>
    /// <param name="lng"></param>
    /// <param name="address"></param>
    public Property(double pid, double pin, double lat, double lng, string address)
    {
      this.Pid = pid;
      this.Pin = pin;
      this.Lat = lat;
      this.Lng = lng;
      this.Address = address;
    }
    #endregion
  }
}
