using Pims.Core.Http.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pims.Ltsa
{
    public interface ILtsaService
    {
        Task<LtsaTokenModel> GetTokenAsync(string pid);
        Task<LtsaOrderModel> ProcessLTSARequest(string pid);
    }
}
