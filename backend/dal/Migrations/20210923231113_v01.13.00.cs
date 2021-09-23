using System;
using Pims.Dal.Helpers.Migrations;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v011300 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.CreateTable(
                name: "ProjectStatusHistory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    ProjectId = table.Column<int>(nullable: false),
                    WorkflowId = table.Column<int>(nullable: false),
                    StatusId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectStatusHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectStatusHistory_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectStatusHistory_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectStatusHistory_ProjectStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "ProjectStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectStatusHistory_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectStatusHistory_Workflows_WorkflowId",
                        column: x => x.WorkflowId,
                        principalTable: "Workflows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusHistory_CreatedById",
                table: "ProjectStatusHistory",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusHistory_ProjectId",
                table: "ProjectStatusHistory",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusHistory_StatusId",
                table: "ProjectStatusHistory",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusHistory_UpdatedById",
                table: "ProjectStatusHistory",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusHistory_WorkflowId",
                table: "ProjectStatusHistory",
                column: "WorkflowId");
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropTable(
                name: "ProjectStatusHistory");
            PostDown(migrationBuilder);
        }
    }
}
