using System;
using Pims.Dal.Helpers.Migrations;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class _010600 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AddColumn<string>(
                name: "EncumbranceReason",
                table: "Parcels",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EffectiveDate",
                table: "ParcelFiscals",
                type: "DATE",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EncumbranceReason",
                table: "Buildings",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EffectiveDate",
                table: "BuildingFiscals",
                type: "DATE",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropColumn(
                name: "EncumbranceReason",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "EffectiveDate",
                table: "ParcelFiscals");

            migrationBuilder.DropColumn(
                name: "EncumbranceReason",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "EffectiveDate",
                table: "BuildingFiscals");
            PostDown(migrationBuilder);
        }
    }
}
