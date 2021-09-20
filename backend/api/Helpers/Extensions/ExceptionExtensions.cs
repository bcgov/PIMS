using Pims.Api.Helpers.Exceptions;
using System;
using Pims.Api.Models;

namespace Pims.Api.Helpers.Extensions
{
    /// <summary>
    /// ExceptionExtensions static class, provides extention methods for exceptions.
    /// </summary>
    public static class ExceptionExtensions
    {
        /// <summary>
        /// Throw an BadRequestException if the item is null.
        /// </summary>
        /// <param name="item"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="BadRequestException">The item cannot be null.</exception>
        public static T ThrowBadRequestIfNull<T>(this T item, string message) where T : class
        {
            if (String.IsNullOrWhiteSpace(message)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(message));
            return item ?? throw new BadRequestException(message);
        }

        /// <summary>
        /// Generate a user friendly error message if exception is referring to a duplicate constraint.
        /// </summary>
        /// <param name="ex"></param>
        /// <param name="message"></param>
        /// <returns>User friendly error message if exception is caused by duplicate. Otherwise null.</returns>
        public static ErrorResponseModel CheckErrorMessageForDuplicate(this Exception ex, string message)
        {
            if (ex.InnerException?.Message.Contains("duplicate") ?? false)
            {
                ErrorResponseModel error = new ErrorResponseModel(message,
                    "Ensure that you have not entered a duplicate name into the system.");
                return error;
            }
            return null;
        }
    }
}
