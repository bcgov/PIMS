using Pims.Ches.Models;
using Pims.Core.Http.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pims.Ches
{
    public interface IChesService
    {
        Task<TokenModel> GetTokenAsync(string username = null, string password = null);
        Task<EmailResponseModel> SendEmailAsync(IEmail email);
        Task<EmailResponseModel> SendEmailAsync(IEmailMerge email);
        Task<StatusResponseModel> GetStatusAsync(Guid messageId);
        Task<IEnumerable<StatusResponseModel>> GetStatusAsync(StatusModel filter);
        Task<CancelResponseModel> CancelEmailAsync(Guid messageId);
        Task<IEnumerable<CancelResponseModel>> CancelEmailAsync(StatusModel filter);
    }
}
