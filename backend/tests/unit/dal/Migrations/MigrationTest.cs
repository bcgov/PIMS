using Pims.Dal.Helpers.Migrations;
using Pims.Dal.Migrations;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Dal.Test.Migrations
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "migration")]
    [ExcludeFromCodeCoverage]
    public class MigrationTest
    {
        #region Constructors
        public MigrationTest() { }
        #endregion

        #region Tests
        /// <summary>
        /// Ensure the first migration is called 'Initial'.
        /// </summary>
        [Fact]
        public void InitialMigration()
        {
            // Arrange
            var initial = new Initial();

            // Act
            // Assert
            Assert.NotNull(initial);
            Assert.IsAssignableFrom<SeedMigration>(initial);
        }
        #endregion
    }
}
