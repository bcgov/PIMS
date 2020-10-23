using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010101 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AlterColumn<decimal>(
                name: "Appraised",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddColumn<string>(
                name: "AppraisedNote",
                table: "Projects",
                type: "NVARCHAR(MAX)",
                nullable: true);
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropColumn(
                name: "AppraisedNote",
                table: "Projects");

            migrationBuilder.AlterColumn<decimal>(
                name: "Appraised",
                table: "Projects",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY");
            PostDown(migrationBuilder);
        }
    }
}
