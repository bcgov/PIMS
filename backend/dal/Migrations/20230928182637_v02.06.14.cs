using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

#nullable disable

namespace Pims.Dal.Migrations
{
    /// <inheritdoc />
    public partial class v020614 : SeedMigration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);

            PostUp(migrationBuilder);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);

            PostDown(migrationBuilder);
        }
    }
}
