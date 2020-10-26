using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class V010102 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //No down action to take, this migration removes invalid data and does not require reversion.
        }
    }
}
