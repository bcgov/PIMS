using Pims.Core.Converters;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    /// <summary>
    /// IEmailMerge interface, provides a structure to manage generating multiple emails with a single template.
    /// </summary>
    public interface IEmailMerge
    {
        /// <summary>
        /// get/set - Who the email are from (i.e. First Last <first.last@email.com>).
        /// </summary>
        string From { get; set; }

        /// <summary>
        /// get/set - The email encoding.
        /// </summary>
        [JsonConverter(typeof(EnumValueJsonConverter<EmailEncodings>))]
        EmailEncodings Encoding { get; set; }

        /// <summary>
        /// get/set - The email priority.
        /// </summary>
        [JsonConverter(typeof(EnumValueJsonConverter<EmailPriorities>))]
        EmailPriorities Priority { get; set; }

        /// <summary>
        /// get/set - The email body type.
        /// </summary>
        [JsonConverter(typeof(EnumValueJsonConverter<EmailBodyTypes>))]
        EmailBodyTypes BodyType { get; set; }

        /// <summary>
        /// get/set - The email subject (template).
        /// </summary>
        string Subject { get; set; }

        /// <summary>
        /// get/set - The email body (template).
        /// </summary>
        string Body { get; set; }

        /// <summary>
        /// get/set - A way to identify related email.
        /// </summary>
        string Tag { get; set; }

        /// <summary>
        /// get/set - An array of template variables.
        /// </summary>
        IEnumerable<IEmailContext> Contexts { get; set; }

        /// <summary>
        /// get/set - An array of attachments.
        /// </summary>
        IEnumerable<IAttachment> Attachments { get; set; }
    }
}
