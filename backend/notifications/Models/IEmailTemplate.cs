using Pims.Core.Converters;
using System.Text.Json.Serialization;

namespace Pims.Notifications.Models
{
    /// <summary>
    /// IEmailTemplate interface, provides a common structure for email templates.
    /// </summary>
    public interface IEmailTemplate
    {
        /// <summary>
        /// get/set - The email subject.
        /// </summary>
        string Subject { get; set; }

        /// <summary>
        /// get/set - The email body type.
        /// </summary>
        [JsonConverter(typeof(EnumValueJsonConverter<EmailBodyTypes>))]
        EmailBodyTypes BodyType { get; set; }

        /// <summary>
        /// get/set - The email body.
        /// </summary>
        string Body { get; set; }
    }
}
