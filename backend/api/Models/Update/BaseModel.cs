namespace Pims.Api.Models.Update
{
    public abstract class BaseModel
    {
        #region Properties
        public string RowVersion { get; set; }
        #endregion
    }
}
