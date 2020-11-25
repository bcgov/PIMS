using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010300 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Agencies_AgencyId1",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_AgencyId1",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_Assessed_NetBook_Estimated_ReportedFiscalYear_ActualFiscalYear_ExemptionRequested",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BaselineIntegrity",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "GainLoss",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "InterestComponent",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "NetProceeds",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "OcgFinancialStatement",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "ProgramCost",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "SaleWithLeaseInPlace",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "SalesCost",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "AgencyId1",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "AppraisedNote",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ExemptionRationale",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ExemptionRequested",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "OffersNote",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "PrivateNote",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "PublicNote",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Estimated",
                table: "ProjectSnapshots",
                newName: "Market");

            migrationBuilder.RenameColumn(
                name: "Estimated",
                table: "Projects",
                newName: "Market");

            migrationBuilder.AlterColumn<decimal>(
                name: "Appraised",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AddColumn<string>(
                name: "Metadata",
                table: "ProjectSnapshots",
                type: "NVARCHAR(MAX)",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Appraised",
                table: "Projects",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AddColumn<int>(
                name: "ProjectType",
                table: "Projects",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Assessed_NetBook_Market_ReportedFiscalYear_ActualFiscalYear",
                table: "Projects",
                columns: new[] { "Assessed", "NetBook", "Market", "ReportedFiscalYear", "ActualFiscalYear" });
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropIndex(
                name: "IX_Projects_Assessed_NetBook_Market_ReportedFiscalYear_ActualFiscalYear",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Metadata",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "ProjectType",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Market",
                table: "ProjectSnapshots",
                newName: "Estimated");

            migrationBuilder.RenameColumn(
                name: "Market",
                table: "Projects",
                newName: "Estimated");

            migrationBuilder.AlterColumn<decimal>(
                name: "Appraised",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BaselineIntegrity",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "GainLoss",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "InterestComponent",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "NetProceeds",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OcgFinancialStatement",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ProgramCost",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SaleWithLeaseInPlace",
                table: "ProjectSnapshots",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "SalesCost",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Appraised",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AgencyId1",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppraisedNote",
                table: "Projects",
                type: "NVARCHAR(MAX)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExemptionRationale",
                table: "Projects",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ExemptionRequested",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Projects",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OffersNote",
                table: "Projects",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivateNote",
                table: "Projects",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicNote",
                table: "Projects",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_AgencyId1",
                table: "Projects",
                column: "AgencyId1");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Assessed_NetBook_Estimated_ReportedFiscalYear_ActualFiscalYear_ExemptionRequested",
                table: "Projects",
                columns: new[] { "Assessed", "NetBook", "Estimated", "ReportedFiscalYear", "ActualFiscalYear", "ExemptionRequested" });

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Agencies_AgencyId1",
                table: "Projects",
                column: "AgencyId1",
                principalTable: "Agencies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            PostDown(migrationBuilder);
        }
    }
}
