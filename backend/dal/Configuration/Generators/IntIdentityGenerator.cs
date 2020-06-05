using Microsoft.EntityFrameworkCore.InMemory.ValueGeneration.Internal;

namespace Pims.Dal.Configuration.Generators
{
    /// <summary>
    /// IntIdentityGenerator class, provides a way to control the generation of identity seeds in memory.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Usage", "EF1001:Internal EF Core API usage.", Justification = "For testing purposes only.")]
    public class IntIdentityGenerator : InMemoryIntegerValueGenerator<int>
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a IntIdentityGenerator object.
        /// </summary>
        public IntIdentityGenerator() : base(1)
        {

        }
        #endregion
    }
}
