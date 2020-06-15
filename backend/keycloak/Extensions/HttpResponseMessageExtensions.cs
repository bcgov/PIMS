using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Pims.Core.Exceptions;
using Pims.Core.Extensions;

namespace Pims.Keycloak.Extensions
{
    /// <summary>
    /// HttpResponseMessageExtensions static class, provides extension methods for HttpResponseMessage objects.
    /// </summary>
    public static class HttpResponseMessageExtensions
    {
        /// <summary>
        /// Provides a generic way to deserialize the response to return the specified 'T' type, or to throw an exception if the request failed.
        /// </summary>
        /// <param name="response"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="HttpClientRequestException">The request failed.</exception>
        /// <returns></returns>
        public static async Task<T> HandleResponseAsync<T>(this HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
            {
                if (response.StatusCode != HttpStatusCode.NoContent)
                {
                    try
                    {
                        using var responseStream = await response.Content.ReadAsStreamAsync();
                        return await responseStream.DeserializeAsync<T>();
                    }
                    catch (Exception ex)
                    {
                        throw new HttpClientRequestException(response, ex);
                    }
                }

                return default;
            }
            else
            {
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    // Keycloak returns 404s when an item doesn't exist instead of the correct 204...
                    // We will have to assume that all 404 are now item does not exist and should be returning a 204 instead.
                    // We will then return 'null'.
                    return default;
                }
                throw new HttpClientRequestException(response);
            }
        }


        /// <summary>
        /// Provides a generic way to return the specified restul, or to throw an exception if the request failed.
        /// </summary>
        /// <param name="response"></param>
        /// <param name="result"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="HttpClientRequestException">The request failed.</exception>
        /// <returns></returns>
        public static T HandleResponse<T>(this HttpResponseMessage response, T result)
        {
            if (response.IsSuccessStatusCode)
            {
                return result;
            }
            else
            {
                throw new HttpClientRequestException(response);
            }
        }
    }
}
