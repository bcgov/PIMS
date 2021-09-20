using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v011202 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.CreateIndex(
                name: "IX_AdministrativeAreas_Name",
                table: "AdministrativeAreas",
                column: "Name",
                unique: true);
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropIndex(
                name: "IX_AdministrativeAreas_Name",
                table: "AdministrativeAreas");
            PostDown(migrationBuilder);
        }
    }
}
