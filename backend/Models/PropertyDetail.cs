using System;

namespace BackendApi.Models
{
  /// <summary>
  /// represents detailed property information.
  /// /// </summary>
  public class PropertyDetail
  {
    #region Properties

    public double Pid { get; set; }
    public String Name { get; set; }
    public String PropertyDetail1 { get; set; }
    public String PropertyDetail2 { get; set; }

    #endregion

    #region Constructors
    /// <summary>
    /// Constructor
    /// </summary>
    public PropertyDetail() { }

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="pid"></param>
    /// <param name="name"></param>
    /// <param name="propertyDetail1"></param>
    /// <param name="propertyDetail2"></param>
    public PropertyDetail(double pid, String name, String propertyDetail1, String propertyDetail2)
    {
      this.Pid = pid;
      this.Name = name;
      this.PropertyDetail1 = PropertyDetail1;
      this.PropertyDetail2 = PropertyDetail2;
    }
    #endregion
  }
}
