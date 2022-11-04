using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v011803 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AddColumn<string>(
                name: "CCEmail",
                table: "Agencies",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropColumn(
                name: "CCEmail",
                table: "Agencies");
            PostDown(migrationBuilder);
        }
    }
}
