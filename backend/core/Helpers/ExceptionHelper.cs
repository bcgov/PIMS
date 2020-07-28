using System;

namespace Pims.Core.Helpers
{
    /// <summary>
    /// ExceptionHelpers static class, provides methods to help with handling exceptions.
    /// /// </summary>
    public static class ExceptionHelper
    {
        /// <summary>
        /// Provides a simple try+catch wrapper to set a variable.
        /// </summary>
        /// <param name="getter"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns>Default of type 'T'.</returns>
        public static T HandleKeyNotFound<T>(Func<T> getter)
        {
            try
            {
                return getter();
            }
            catch (System.Collections.Generic.KeyNotFoundException)
            {
                return default;
            }
        }

        /// <summary>
        /// Provides a simple try+catch wrapper to set a variable.
        /// </summary>
        /// <param name="getValue"></param>
        /// <param name="setter"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T HandleKeyNotFound<T>(Func<T> getter, Func<T> setter)
        {
            try
            {
                return getter();
            }
            catch (System.Collections.Generic.KeyNotFoundException)
            {
                return setter();
            }
        }

        /// <summary>
        /// Provides a simple try+catch wrapper to set a variable.
        /// </summary>
        /// <param name="getter"></param>
        /// <param name="defaultValue"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T HandleKeyNotFound<T>(Func<T> getter, T defaultValue)
        {
            try
            {
                return getter();
            }
            catch (System.Collections.Generic.KeyNotFoundException)
            {
                return defaultValue;
            }
        }

        /// <summary>
        /// Provides a simple try+catch wrapper to set a variable.
        /// This will create a default instance of type 'T' if the 'getter' fails.
        /// </summary>
        /// <param name="getter"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T HandleKeyNotFoundWithDefault<T>(Func<T> getter)
        {
            try
            {
                return getter();
            }
            catch (System.Collections.Generic.KeyNotFoundException)
            {
                return Activator.CreateInstance<T>();
            }
        }

        /// <summary>
        /// Provides a simple try+catch wrapper to set a variable.
        /// This will create a default instance of type 'T' if the 'getter' fails.
        /// </summary>
        /// <param name="getter"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T HandleExceptionWithDefault<T>(Func<T> getter)
        {
            try
            {
                return getter();
            }
            catch (Exception)
            {
                return Activator.CreateInstance<T>();
            }
        }
    }
}
