using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010400 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);

            migrationBuilder.DropForeignKey(
                name: "FK_WorkflowProjectStatus_ProjectStatus_ProjectStatusId",
                table: "WorkflowProjectStatus");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkflowProjectStatus_Workflows_WorkflowId1",
                table: "WorkflowProjectStatus");

            migrationBuilder.DropIndex(
                name: "IX_WorkflowProjectStatus_ProjectStatusId",
                table: "WorkflowProjectStatus");

            migrationBuilder.DropIndex(
                name: "IX_WorkflowProjectStatus_WorkflowId1",
                table: "WorkflowProjectStatus");

            migrationBuilder.DropColumn(
                name: "ProjectStatusId",
                table: "WorkflowProjectStatus");

            migrationBuilder.DropColumn(
                name: "WorkflowId1",
                table: "WorkflowProjectStatus");

            migrationBuilder.RenameColumn(
                name: "ReportTypeId",
                table: "ProjectReports",
                newName: "ReportType");

            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);

            migrationBuilder.AddColumn<int>(
                name: "ProjectStatusId",
                table: "WorkflowProjectStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorkflowId1",
                table: "WorkflowProjectStatus",
                type: "int",
                nullable: true);

            migrationBuilder.RenameColumn(
                name: "ReportType",
                table: "ProjectReports",
                newName: "ReportTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkflowProjectStatus_ProjectStatusId",
                table: "WorkflowProjectStatus",
                column: "ProjectStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkflowProjectStatus_WorkflowId1",
                table: "WorkflowProjectStatus",
                column: "WorkflowId1");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkflowProjectStatus_ProjectStatus_ProjectStatusId",
                table: "WorkflowProjectStatus",
                column: "ProjectStatusId",
                principalTable: "ProjectStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkflowProjectStatus_Workflows_WorkflowId1",
                table: "WorkflowProjectStatus",
                column: "WorkflowId1",
                principalTable: "Workflows",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            PostDown(migrationBuilder);
        }
    }
}