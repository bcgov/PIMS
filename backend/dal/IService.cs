namespace Pims.Dal
{
    public interface IService
    {
        T OriginalValue<T>(object entity, string propertyName);
    }
}
