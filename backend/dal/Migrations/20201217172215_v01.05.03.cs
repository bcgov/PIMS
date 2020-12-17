using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010503 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AddColumn<string>(
                name: "LeasedLandMetadata",
                table: "Buildings",
                type: "NVARCHAR(MAX)",
                nullable: true);
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropColumn(
                name: "LeasedLandMetadata",
                table: "Buildings");
            PostDown(migrationBuilder);
        }
    }
}
