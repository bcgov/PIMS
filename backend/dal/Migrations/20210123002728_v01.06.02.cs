using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010602 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "Projects",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "Projects",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "Projects",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);
            PostDown(migrationBuilder);
        }
    }
}
