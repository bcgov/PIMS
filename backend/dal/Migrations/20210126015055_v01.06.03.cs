using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010603 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Zoning_ZoningPotential",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionTypeId_BuildingPredominateUse~",
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
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumbers_BuildingConstructionTypeId_BuildingPredominateUs~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "AddressId", "ProjectNumbers", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_LandArea_Zoning_ZoningPotential",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumbers_BuildingConstructionTypeId_BuildingPredominateUs~",
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
            PostDown(migrationBuilder);
        }
    }
}
