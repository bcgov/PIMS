using System;
using System.Collections.Generic;

namespace Pims.Ches.Models
{
    public interface IEmailContext
    {
        IEnumerable<string> Bcc { get; set; }
        IEnumerable<string> Cc { get; set; }
        object Context { get; set; }
        DateTime SendOn { get; set; }
        string Tag { get; set; }
        IEnumerable<string> To { get; set; }
    }
}
