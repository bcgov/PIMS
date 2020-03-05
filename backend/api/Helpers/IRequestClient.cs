using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Pims.Api.Helpers
{
    public interface IRequestClient
    {
        public Task<HttpResponseMessage> GetAsync(HttpRequest request, string url);
    }
}
