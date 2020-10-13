using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010001 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Latitude_Longitude_IsSensitive_AgencyId_ClassificationId_ProjectNumber_LandArea_Municipality_Zoning_ZoningPotential_~",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Cities_IsDisabled_Name_SortOrder",
                table: "Cities");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Latitude_Longitude_LocalId_IsSensitive_AgencyId_ClassificationId_ProjectNumber_BuildingConstructionTypeId_Building~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_CityId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Postal_Address1",
                table: "Addresses");

            migrationBuilder.AlterColumn<decimal>(
                name: "SalesCost",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "ProgramCost",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "NetProceeds",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "InterestComponent",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<decimal>(
                name: "GainLoss",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "MONEY");

            migrationBuilder.AlterColumn<bool>(
                name: "SendEmail",
                table: "Agencies",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Id_AgencyId_IsSensitive_AddressId",
                table: "Parcels",
                columns: new[] { "Id", "AgencyId", "IsSensitive", "AddressId" });

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zoning_ZoningPotential",
                table: "Parcels",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "PID", "PIN", "AddressId", "ProjectNumber", "LandArea", "Municipality", "Zoning", "ZoningPotential" });

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Id_Latitude_Longitude_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zo~",
                table: "Parcels",
                columns: new[] { "Id", "Latitude", "Longitude", "IsSensitive", "AgencyId", "ClassificationId", "PID", "PIN", "AddressId", "ProjectNumber", "LandArea", "Municipality", "Zoning", "ZoningPotential" });

            migrationBuilder.CreateIndex(
                name: "IX_ParcelFiscals_ParcelId_Key",
                table: "ParcelFiscals",
                columns: new[] { "ParcelId", "Key" });

            migrationBuilder.CreateIndex(
                name: "IX_ParcelEvaluations_ParcelId_Key",
                table: "ParcelEvaluations",
                columns: new[] { "ParcelId", "Key" });

            migrationBuilder.CreateIndex(
                name: "IX_Cities_Id_IsDisabled_Name_SortOrder",
                table: "Cities",
                columns: new[] { "Id", "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstru~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ParcelId", "ClassificationId", "AddressId", "ProjectNumber", "BuildingPredominateUseId", "BuildingConstructionTypeId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_Latitude_Longitude_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionT~",
                table: "Buildings",
                columns: new[] { "Id", "Latitude", "Longitude", "IsSensitive", "AgencyId", "ParcelId", "ClassificationId", "AddressId", "ProjectNumber", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingFiscals_BuildingId_Key",
                table: "BuildingFiscals",
                columns: new[] { "BuildingId", "Key" });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingEvaluations_BuildingId_Key",
                table: "BuildingEvaluations",
                columns: new[] { "BuildingId", "Key" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_CityId_ProvinceId",
                table: "Addresses",
                columns: new[] { "CityId", "ProvinceId" })
                .Annotation("SqlServer:Include", new[] { "Address1", "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_Address1",
                table: "Addresses",
                columns: new[] { "Id", "Address1" })
                .Annotation("SqlServer:Include", new[] { "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_CityId",
                table: "Addresses",
                columns: new[] { "Id", "CityId" })
                .Annotation("SqlServer:Include", new[] { "Address1", "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_Postal",
                table: "Addresses",
                columns: new[] { "Id", "Postal" })
                .Annotation("SqlServer:Include", new[] { "Address1", "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_ProvinceId_CityId_Postal_Address1",
                table: "Addresses",
                columns: new[] { "Id", "ProvinceId", "CityId", "Postal", "Address1" })
                .Annotation("SqlServer:Include", new[] { "Address2" });

            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_AgencyId_IsSensitive_AddressId",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zoning_ZoningPotential",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_Latitude_Longitude_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zo~",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_ParcelFiscals_ParcelId_Key",
                table: "ParcelFiscals");

            migrationBuilder.DropIndex(
                name: "IX_ParcelEvaluations_ParcelId_Key",
                table: "ParcelEvaluations");

            migrationBuilder.DropIndex(
                name: "IX_Cities_Id_IsDisabled_Name_SortOrder",
                table: "Cities");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstru~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_Latitude_Longitude_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionT~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_BuildingFiscals_BuildingId_Key",
                table: "BuildingFiscals");

            migrationBuilder.DropIndex(
                name: "IX_BuildingEvaluations_BuildingId_Key",
                table: "BuildingEvaluations");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_CityId_ProvinceId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_Address1",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_CityId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_Postal",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_ProvinceId_CityId_Postal_Address1",
                table: "Addresses");

            migrationBuilder.AlterColumn<decimal>(
                name: "SalesCost",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "ProgramCost",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "NetProceeds",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "InterestComponent",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "GainLoss",
                table: "ProjectSnapshots",
                type: "MONEY",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "MONEY",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "SendEmail",
                table: "Agencies",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool));

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Latitude_Longitude_IsSensitive_AgencyId_ClassificationId_ProjectNumber_LandArea_Municipality_Zoning_ZoningPotential_~",
                table: "Parcels",
                columns: new[] { "Latitude", "Longitude", "IsSensitive", "AgencyId", "ClassificationId", "ProjectNumber", "LandArea", "Municipality", "Zoning", "ZoningPotential", "Description" });

            migrationBuilder.CreateIndex(
                name: "IX_Cities_IsDisabled_Name_SortOrder",
                table: "Cities",
                columns: new[] { "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Latitude_Longitude_LocalId_IsSensitive_AgencyId_ClassificationId_ProjectNumber_BuildingConstructionTypeId_Building~",
                table: "Buildings",
                columns: new[] { "Latitude", "Longitude", "LocalId", "IsSensitive", "AgencyId", "ClassificationId", "ProjectNumber", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_CityId",
                table: "Addresses",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Postal_Address1",
                table: "Addresses",
                columns: new[] { "Postal", "Address1" });

            PostDown(migrationBuilder);
        }
    }
}
