using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class PA635 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FromSnapshotId",
                table: "ProjectSnapshots",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFinal",
                table: "ProjectSnapshots",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ProjectSnapshots",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SnapshotOn",
                table: "ProjectSnapshots",
                type: "DATETIME2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSnapshots_FromSnapshotId",
                table: "ProjectSnapshots",
                column: "FromSnapshotId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectSnapshots_ProjectSnapshots_FromSnapshotId",
                table: "ProjectSnapshots",
                column: "FromSnapshotId",
                principalTable: "ProjectSnapshots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectSnapshots_ProjectSnapshots_FromSnapshotId",
                table: "ProjectSnapshots");

            migrationBuilder.DropIndex(
                name: "IX_ProjectSnapshots_FromSnapshotId",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "FromSnapshotId",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "IsFinal",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "ProjectSnapshots");

            migrationBuilder.DropColumn(
                name: "SnapshotOn",
                table: "ProjectSnapshots");
        }
    }
}
