namespace Pims.Ches.Models
{
    public interface IAttachment
    {
        string Content { get; set; }
        string ContentType { get; set; }
        string Encoding { get; set; }
        string Filename { get; set; }
    }
}