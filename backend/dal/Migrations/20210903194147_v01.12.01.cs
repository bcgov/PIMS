using System;
using Pims.Dal.Helpers.Migrations;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v011201 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AddColumn<Guid>(
                name: "KeycloakUserId",
                table: "Users",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_KeycloakUserId_Username_Email",
                table: "Users",
                columns: new[] { "KeycloakUserId", "Username", "Email" },
                unique: true,
                filter: "[KeycloakUserId] IS NOT NULL");
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropIndex(
                name: "IX_Users_KeycloakUserId_Username_Email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "KeycloakUserId",
                table: "Users");
            PostDown(migrationBuilder);
        }
    }
}
