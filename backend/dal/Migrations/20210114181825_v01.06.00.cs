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

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Zoning_ZoningPotential",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionTypeId_BuildingPredominateUse~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstructionType~",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "ProjectNumber",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "ProjectNumber",
                table: "Buildings");

            migrationBuilder.AddColumn<string>(
                name: "ProjectNumbers",
                table: "Parcels",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectNumbers",
                table: "Buildings",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_LandArea_Zoning_ZoningPotential",
                table: "Parcels",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "PID", "PIN", "AddressId", "LandArea", "Zoning", "ZoningPotential" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionTypeId_BuildingPredominateUse~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "AddressId", "ProjectNumbers", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstructionType~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "AddressId", "ProjectNumbers", "BuildingPredominateUseId", "BuildingConstructionTypeId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "Projects",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "Projects",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "Projects",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_LandArea_Zoning_ZoningPotential",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionTypeId_BuildingPredominateUse~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstructionType~",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "ProjectNumbers",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "ProjectNumbers",
                table: "Buildings");

            migrationBuilder.AddColumn<string>(
                name: "ProjectNumber",
                table: "Parcels",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectNumber",
                table: "Buildings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Zoning_ZoningPotential",
                table: "Parcels",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "PID", "PIN", "AddressId", "ProjectNumber", "LandArea", "Zoning", "ZoningPotential" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionTypeId_BuildingPredominateUse~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "AddressId", "ProjectNumber", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstructionType~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "AddressId", "ProjectNumber", "BuildingPredominateUseId", "BuildingConstructionTypeId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

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

            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "NetBook",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Market",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Assessed",
                table: "Projects",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            PostDown(migrationBuilder);
        }
    }
}
