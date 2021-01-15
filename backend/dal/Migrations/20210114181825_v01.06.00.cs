using System;
using Pims.Dal.Helpers.Migrations;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010600 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AddColumn<string>(
                name: "EncumbranceReason",
                table: "Parcels",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EffectiveDate",
                table: "ParcelFiscals",
                type: "DATE",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BuildingTenancyUpdatedOn",
                table: "Buildings",
                type: "DATETIME2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EncumbranceReason",
                table: "Buildings",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LeasedLandMetadata",
                table: "Buildings",
                type: "NVARCHAR(MAX)",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "TotalArea",
                table: "Buildings",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<DateTime>(
                name: "EffectiveDate",
                table: "BuildingFiscals",
                type: "DATE",
                nullable: true);
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
                name: "BuildingTenancyUpdatedOn",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "EncumbranceReason",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "LeasedLandMetadata",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "TotalArea",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "EffectiveDate",
                table: "BuildingFiscals");
            PostDown(migrationBuilder);
        }
    }
}
