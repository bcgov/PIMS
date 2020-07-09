using Pims.Core.Converters;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Notifications.Models
{
    /// <summary>
    /// IEmail interface, provides a common structure for emails.
    /// </summary>
    public interface IEmail : IEmailTemplate
    {
        /// <summary>
        /// get/set - Who the email is from (i.e. First Last <first.last@email.com>).
        /// </summary>
        string From { get; set; }

        /// <summary>
        /// get/set - An array of email addresses this email will be sent to.
        /// </summary>
        IEnumerable<string> To { get; set; }

        /// <summary>
        /// get/set - An array of email addresses to carbon-copy.
        /// </summary>
        IEnumerable<string> Cc { get; set; }

        /// <summary>
        /// get/set - An array of email addresses to blind carbon-copy.
        /// </summary>
        IEnumerable<string> Bcc { get; set; }

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
        /// get/set - A tag to identify related emails.
        /// </summary>
        string Tag { get; set; }

        /// <summary>
        /// get/set - The date that the email should be sent.
        /// </summary>
        DateTime SendOn { get; set; }
    }
}
