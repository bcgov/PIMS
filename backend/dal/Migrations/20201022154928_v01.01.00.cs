using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010100 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);

            migrationBuilder.DropIndex(
                name: "IX_ProjectSnapshots_ProjectId_CreatedOn",
                table: "ProjectSnapshots");

            migrationBuilder.AddColumn<decimal>(
                name: "Appraised",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "AppraisedNote",
                table: "Projects",
                type: "NVARCHAR(MAX)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Appraised",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "BaselineIntegrity",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SnapshotOn",
                table: "ProjectSnapshots",
                type: "DATETIME2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "ProjectReports",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    IsFinal = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: true),
                    From = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    To = table.Column<DateTime>(type: "DATETIME2", nullable: false),
                    ReportTypeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectReports_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectReports_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSnapshots_ProjectId_SnapshotOn",
                table: "ProjectSnapshots",
                columns: new[] { "ProjectId", "SnapshotOn" });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectReports_CreatedById",
                table: "ProjectReports",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectReports_UpdatedById",
                table: "ProjectReports",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectReports_Id_To_From_IsFinal",
                table: "ProjectReports",
                columns: new[] { "Id", "To", "From", "IsFinal" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);

            migrationBuilder.DropTable(
                name: "ProjectReports");

            migrationBuilder.DropIndex(
                name: "IX_ProjectSnapshots_ProjectId_SnapshotOn",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "Appraised",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "AppraisedNote",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BaselineIntegrity",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "SnapshotOn",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "Appraised",
                table: "Projects");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSnapshots_ProjectId_CreatedOn",
                table: "ProjectSnapshots",
                columns: new[] { "ProjectId", "CreatedOn" });
        }
    }
}
