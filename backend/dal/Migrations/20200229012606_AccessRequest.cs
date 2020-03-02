using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class AccessRequest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AccessRequestId",
                table: "Roles",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AccessRequestId",
                table: "Agencies",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AccessRequest",
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
                    UserId = table.Column<Guid>(nullable: true),
                    AgencyId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AccessRequest_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequest_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequest_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Roles_AccessRequestId",
                table: "Roles",
                column: "AccessRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_AccessRequestId",
                table: "Agencies",
                column: "AccessRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequest_CreatedById",
                table: "AccessRequest",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequest_UpdatedById",
                table: "AccessRequest",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequest_UserId",
                table: "AccessRequest",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequest_IsDisabled_IsGranted",
                table: "AccessRequest",
                columns: new[] { "IsDisabled", "IsGranted" });

            migrationBuilder.AddForeignKey(
                name: "FK_Agencies_AccessRequest_AccessRequestId",
                table: "Agencies",
                column: "AccessRequestId",
                principalTable: "AccessRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_AccessRequest_AccessRequestId",
                table: "Roles",
                column: "AccessRequestId",
                principalTable: "AccessRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agencies_AccessRequest_AccessRequestId",
                table: "Agencies");

            migrationBuilder.DropForeignKey(
                name: "FK_Roles_AccessRequest_AccessRequestId",
                table: "Roles");

            migrationBuilder.DropTable(
                name: "AccessRequest");

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
        }
    }
}
