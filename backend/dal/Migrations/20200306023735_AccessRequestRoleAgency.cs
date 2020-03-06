using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class AccessRequestRoleAgency : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agencies_AccessRequests_AccessRequestId",
                table: "Agencies");

            migrationBuilder.DropForeignKey(
                name: "FK_Roles_AccessRequests_AccessRequestId",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Roles_AccessRequestId",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Agencies_AccessRequestId",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "AccessRequestId",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "AccessRequestId",
                table: "Agencies");

            migrationBuilder.CreateTable(
                name: "AccessRequestAgencies",
                columns: table => new
                {
                    AccessRequestId = table.Column<Guid>(nullable: false),
                    AgencyId = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessRequestAgencies", x => new { x.AccessRequestId, x.AgencyId });
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_AccessRequests_AccessRequestId",
                        column: x => x.AccessRequestId,
                        principalTable: "AccessRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_Agencies_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "Agencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AccessRequestRoles",
                columns: table => new
                {
                    AccessRequestId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessRequestRoles", x => new { x.AccessRequestId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_AccessRequests_AccessRequestId",
                        column: x => x.AccessRequestId,
                        principalTable: "AccessRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestAgencies_AgencyId",
                table: "AccessRequestAgencies",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestAgencies_CreatedById",
                table: "AccessRequestAgencies",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestAgencies_UpdatedById",
                table: "AccessRequestAgencies",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestRoles_CreatedById",
                table: "AccessRequestRoles",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestRoles_RoleId",
                table: "AccessRequestRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestRoles_UpdatedById",
                table: "AccessRequestRoles",
                column: "UpdatedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessRequestAgencies");

            migrationBuilder.DropTable(
                name: "AccessRequestRoles");

            migrationBuilder.AddColumn<Guid>(
                name: "AccessRequestId",
                table: "Roles",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AccessRequestId",
                table: "Agencies",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_AccessRequestId",
                table: "Roles",
                column: "AccessRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_AccessRequestId",
                table: "Agencies",
                column: "AccessRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Agencies_AccessRequests_AccessRequestId",
                table: "Agencies",
                column: "AccessRequestId",
                principalTable: "AccessRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_AccessRequests_AccessRequestId",
                table: "Roles",
                column: "AccessRequestId",
                principalTable: "AccessRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
