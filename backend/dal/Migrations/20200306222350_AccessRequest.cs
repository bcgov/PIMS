using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class AccessRequest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "Roles",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisabled",
                table: "Provinces",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "Provinces",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AccessRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    IsDisabled = table.Column<bool>(nullable: false),
                    IsGranted = table.Column<bool>(nullable: true),
                    UserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AccessRequests_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequests_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_CreatedById",
                table: "AccessRequests",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_UpdatedById",
                table: "AccessRequests",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_UserId",
                table: "AccessRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_IsDisabled_IsGranted",
                table: "AccessRequests",
                columns: new[] { "IsDisabled", "IsGranted" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessRequestAgencies");

            migrationBuilder.DropTable(
                name: "AccessRequestRoles");

            migrationBuilder.DropTable(
                name: "AccessRequests");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "IsDisabled",
                table: "Provinces");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "Provinces");
        }
    }
}
