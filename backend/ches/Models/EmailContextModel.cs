using System;
using System.Collections.Generic;

namespace Pims.Ches.Models
{
    /// <summary>
    /// EmailContextModel class, provides a way to generate multiple emails from the same template.
    /// </summary>
    public class EmailContextModel : IEmailContext
    {
        #region Properties
        /// <summary>
        /// get/set - An array of email addresses the email will be sent to.
        /// </summary>
        public IEnumerable<string> To { get; set; } = new List<string>();

        /// <summary>
        /// get/set - An array of email addresses that the email will be carbon-copied.
        /// </summary>
        public IEnumerable<string> Cc { get; set; } = new List<string>();

        /// <summary>
        /// get/set - An array of email addresses that the email will be blind carbon-copied.
        /// </summary>
        public IEnumerable<string> Bcc { get; set; } = new List<string>();

        /// <summary>
        /// get/set - A structure that provides the template variables values.
        /// </summary>
        public object Context { get; set; }

        /// <summary>
        /// get/set - When the email will be sent.
        /// </summary>
        public DateTime SendOn { get; set; }

        /// <summary>
        /// get/set - A way to identify related emails.
        /// </summary>
        public string Tag { get; set; }
        #endregion
    }
}
