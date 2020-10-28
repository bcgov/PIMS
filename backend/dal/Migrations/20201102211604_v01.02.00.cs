using System;
using Pims.Dal.Helpers.Migrations;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

namespace Pims.Dal.Migrations
{
    public partial class v010200 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Cities_CityId",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Buildings_Parcels_ParcelId",
                table: "Buildings");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zoning_ZoningPotential",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_Latitude_Longitude_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zo~",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_ParcelId",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstru~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_Latitude_Longitude_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionT~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_CityId_ProvinceId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_CityId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_ProvinceId_CityId_Postal_Address1",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "Municipality",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "LocalId",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "ParcelId",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "Addresses");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Parcels",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150,
                oldNullable: true);

            migrationBuilder.AddColumn<Geometry>(
                name: "Boundary",
                table: "Parcels",
                type: "GEOGRAPHY",
                nullable: true);

            migrationBuilder.AddColumn<Point>(
                name: "Location",
                table: "Parcels",
                type: "GEOGRAPHY",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Buildings",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150,
                oldNullable: true);

            migrationBuilder.AddColumn<Geometry>(
                name: "Boundary",
                table: "Buildings",
                type: "GEOGRAPHY",
                nullable: true);

            migrationBuilder.AddColumn<Point>(
                name: "Location",
                table: "Buildings",
                type: "GEOGRAPHY",
                nullable: true);

            ScriptDeploy(migrationBuilder, System.IO.Path.Combine(this.DefaultMigrationsPath, this.Version, System.IO.Path.Combine("Up", "Properties")));

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Buildings");

            migrationBuilder.AddColumn<string>(
                name: "AdministrativeArea",
                table: "Addresses",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AdministrativeAreas",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(nullable: false, defaultValue: 0),
                    Abbreviation = table.Column<string>(maxLength: 100, nullable: true),
                    BoundaryType = table.Column<string>(maxLength: 50, nullable: true),
                    GroupName = table.Column<string>(maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdministrativeAreas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdministrativeAreas_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AdministrativeAreas_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ParcelBuildings",
                columns: table => new
                {
                    ParcelId = table.Column<int>(nullable: false),
                    BuildingId = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParcelBuildings", x => new { x.ParcelId, x.BuildingId });
                    table.ForeignKey(
                        name: "FK_ParcelBuildings_Buildings_BuildingId",
                        column: x => x.BuildingId,
                        principalTable: "Buildings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelBuildings_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelBuildings_Parcels_ParcelId",
                        column: x => x.ParcelId,
                        principalTable: "Parcels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelBuildings_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_AdministrativeArea_ProvinceId",
                table: "Addresses",
                columns: new[] { "AdministrativeArea", "ProvinceId" })
                .Annotation("SqlServer:Include", new[] { "Address1", "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_AdministrativeArea",
                table: "Addresses",
                columns: new[] { "Id", "AdministrativeArea" })
                .Annotation("SqlServer:Include", new[] { "Address1", "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_ProvinceId_AdministrativeArea_Postal_Address1",
                table: "Addresses",
                columns: new[] { "Id", "ProvinceId", "AdministrativeArea", "Postal", "Address1" })
                .Annotation("SqlServer:Include", new[] { "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_AdministrativeAreas_CreatedById",
                table: "AdministrativeAreas",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AdministrativeAreas_UpdatedById",
                table: "AdministrativeAreas",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AdministrativeAreas_Id_IsDisabled_Name_SortOrder",
                table: "AdministrativeAreas",
                columns: new[] { "Id", "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_ParcelBuildings_BuildingId",
                table: "ParcelBuildings",
                column: "BuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelBuildings_CreatedById",
                table: "ParcelBuildings",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelBuildings_UpdatedById",
                table: "ParcelBuildings",
                column: "UpdatedById");
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropTable(
                name: "AdministrativeAreas");

            migrationBuilder.DropTable(
                name: "ParcelBuildings");

            migrationBuilder.DropIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Zoning_ZoningPotential",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionTypeId_BuildingPredominateUse~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstructionType~",
                table: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_AdministrativeArea_ProvinceId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_AdministrativeArea",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Id_ProvinceId_AdministrativeArea_Postal_Address1",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "Boundary",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "Boundary",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "AdministrativeArea",
                table: "Addresses");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Parcels",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Parcels",
                type: "float",
                nullable: true,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Parcels",
                type: "float",
                nullable: true,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Municipality",
                table: "Parcels",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Buildings",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Buildings",
                type: "float",
                nullable: true,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "LocalId",
                table: "Buildings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Buildings",
                type: "float",
                nullable: true,
                defaultValue: 0.0);

            ScriptDeploy(migrationBuilder, System.IO.Path.Combine(this.DefaultMigrationsPath, this.Version, System.IO.Path.Combine("Down", "Properties")));

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Buildings");

            migrationBuilder.AddColumn<int>(
                name: "ParcelId",
                table: "Buildings",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "Addresses",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    IsDisabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UpdatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cities_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Cities_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Id_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zoning_ZoningPotential",
                table: "Parcels",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "PID", "PIN", "AddressId", "ProjectNumber", "LandArea", "Municipality", "Zoning", "ZoningPotential" });

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Id_Latitude_Longitude_IsSensitive_AgencyId_ClassificationId_PID_PIN_AddressId_ProjectNumber_LandArea_Municipality_Zo~",
                table: "Parcels",
                columns: new[] { "Id", "Latitude", "Longitude", "IsSensitive", "AgencyId", "ClassificationId", "PID", "PIN", "AddressId", "ProjectNumber", "LandArea", "Municipality", "Zoning", "ZoningPotential" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_ParcelId",
                table: "Buildings",
                column: "ParcelId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstru~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ParcelId", "ClassificationId", "AddressId", "ProjectNumber", "BuildingPredominateUseId", "BuildingConstructionTypeId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_Latitude_Longitude_IsSensitive_AgencyId_ParcelId_ClassificationId_AddressId_ProjectNumber_BuildingConstructionT~",
                table: "Buildings",
                columns: new[] { "Id", "Latitude", "Longitude", "IsSensitive", "AgencyId", "ParcelId", "ClassificationId", "AddressId", "ProjectNumber", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_CityId_ProvinceId",
                table: "Addresses",
                columns: new[] { "CityId", "ProvinceId" })
                .Annotation("SqlServer:Include", new[] { "Address1", "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_CityId",
                table: "Addresses",
                columns: new[] { "Id", "CityId" })
                .Annotation("SqlServer:Include", new[] { "Address1", "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Id_ProvinceId_CityId_Postal_Address1",
                table: "Addresses",
                columns: new[] { "Id", "ProvinceId", "CityId", "Postal", "Address1" })
                .Annotation("SqlServer:Include", new[] { "Address2" });

            migrationBuilder.CreateIndex(
                name: "IX_Cities_Code",
                table: "Cities",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cities_CreatedById",
                table: "Cities",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_UpdatedById",
                table: "Cities",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_Id_IsDisabled_Name_SortOrder",
                table: "Cities",
                columns: new[] { "Id", "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Cities_CityId",
                table: "Addresses",
                column: "CityId",
                principalTable: "Cities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Buildings_Parcels_ParcelId",
                table: "Buildings",
                column: "ParcelId",
                principalTable: "Parcels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            PostDown(migrationBuilder);
        }
    }
}
