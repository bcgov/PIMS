using System.IO;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// StreamExtensions static class, provides extension methods for streams.
    /// </summary>
    public static class StreamExtensions
    {
        /// <summary>
        /// Reads the stream into a string.
        /// </summary>
        /// <param name="stream"></param>
        /// <returns></returns>
        public static string ReadStream(this Stream stream)
        {
            var readStream = new StreamReader(stream);
            var result = readStream.ReadToEnd();
            stream.Position = 0;
            return result;
        }
    }
}
