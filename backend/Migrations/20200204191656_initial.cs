using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Api.Helpers.Migrations;

namespace Pims.Api.Migrations
{
    public partial class initial : SeedMigration
    {
        protected override void Up (MigrationBuilder migrationBuilder)
        {
            PreDeploy (migrationBuilder);

            migrationBuilder.CreateTable (
                name: "Users",
                columns : table => new
                {
                    Id = table.Column<Guid> (nullable: false),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        DisplayName = table.Column<string> (maxLength: 100, nullable: false),
                        FirstName = table.Column<string> (maxLength: 100, nullable: false),
                        MiddleName = table.Column<string> (maxLength: 100, nullable: true),
                        LastName = table.Column<string> (maxLength: 100, nullable: false),
                        Email = table.Column<string> (maxLength: 100, nullable: false),
                        IsDisabled = table.Column<bool> (nullable: false)
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_Users", x => x.Id);
                    table.ForeignKey (
                        name: "FK_Users_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Users_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "BuildingConstructionTypes",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Name = table.Column<string> (maxLength: 150, nullable: false),
                        IsDisabled = table.Column<bool> (nullable: false, defaultValueSql: "1")
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_BuildingConstructionTypes", x => x.Id);
                    table.ForeignKey (
                        name: "FK_BuildingConstructionTypes_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_BuildingConstructionTypes_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "BuildingPredominateUses",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Name = table.Column<string> (maxLength: 150, nullable: false),
                        IsDisabled = table.Column<bool> (nullable: false, defaultValueSql: "1")
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_BuildingPredominateUses", x => x.Id);
                    table.ForeignKey (
                        name: "FK_BuildingPredominateUses_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_BuildingPredominateUses_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "Cities",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false)
                        .Annotation ("SqlServer:Identity", "1, 1"),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Name = table.Column<string> (maxLength: 150, nullable: false),
                        Code = table.Column<string> (maxLength: 4, nullable: false)
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_Cities", x => x.Id);
                    table.ForeignKey (
                        name: "FK_Cities_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Cities_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "PropertyClassifications",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Name = table.Column<string> (maxLength: 150, nullable: false),
                        IsDisabled = table.Column<bool> (nullable: false, defaultValueSql: "1")
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_PropertyClassifications", x => x.Id);
                    table.ForeignKey (
                        name: "FK_PropertyClassifications_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_PropertyClassifications_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "PropertyStatus",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Name = table.Column<string> (maxLength: 150, nullable: false),
                        IsDisabled = table.Column<bool> (nullable: false, defaultValueSql: "1")
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_PropertyStatus", x => x.Id);
                    table.ForeignKey (
                        name: "FK_PropertyStatus_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_PropertyStatus_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "PropertyTypes",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Name = table.Column<string> (maxLength: 150, nullable: false),
                        IsDisabled = table.Column<bool> (nullable: false, defaultValueSql: "1")
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_PropertyTypes", x => x.Id);
                    table.ForeignKey (
                        name: "FK_PropertyTypes_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_PropertyTypes_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "Provinces",
                columns : table => new
                {
                    Id = table.Column<string> (maxLength: 2, nullable: false),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Name = table.Column<string> (maxLength: 150, nullable: false)
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_Provinces", x => x.Id);
                    table.ForeignKey (
                        name: "FK_Provinces_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Provinces_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "Addresses",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false)
                        .Annotation ("SqlServer:Identity", "1, 1"),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        Address1 = table.Column<string> (maxLength: 150, nullable: true),
                        Address2 = table.Column<string> (maxLength: 150, nullable: true),
                        CityId = table.Column<int> (nullable: false),
                        ProvinceId = table.Column<string> (maxLength: 2, nullable: false),
                        Postal = table.Column<string> (maxLength: 6, nullable: true)
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_Addresses", x => x.Id);
                    table.ForeignKey (
                        name: "FK_Addresses_Cities_CityId",
                        column : x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Addresses_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Addresses_Provinces_ProvinceId",
                        column : x => x.ProvinceId,
                        principalTable: "Provinces",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Addresses_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "Parcels",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false)
                        .Annotation ("SqlServer:Identity", "1, 1"),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        ParcelId = table.Column<int> (nullable: false),
                        LocalId = table.Column<int> (nullable: false),
                        StatusId = table.Column<int> (nullable: false),
                        ClassificationId = table.Column<int> (nullable: false),
                        Description = table.Column<string> (maxLength: 2000, nullable: true),
                        AssessedValue = table.Column<float> (nullable: false),
                        AddressId = table.Column<int> (nullable: false),
                        Latitude = table.Column<double> (nullable: false),
                        Longitude = table.Column<double> (nullable: false),
                        LandArea = table.Column<float> (nullable: false),
                        LandLegalDescription = table.Column<string> (maxLength: 500, nullable: true)
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_Parcels", x => x.Id);
                    table.ForeignKey (
                        name: "FK_Parcels_Addresses_AddressId",
                        column : x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Parcels_PropertyClassifications_ClassificationId",
                        column : x => x.ClassificationId,
                        principalTable: "PropertyClassifications",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Parcels_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Parcels_PropertyStatus_StatusId",
                        column : x => x.StatusId,
                        principalTable: "PropertyStatus",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Parcels_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable (
                name: "Buildings",
                columns : table => new
                {
                    Id = table.Column<int> (nullable: false)
                        .Annotation ("SqlServer:Identity", "1, 1"),
                        CreatedById = table.Column<Guid> (nullable: true),
                        CreatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : false, defaultValueSql: "GETUTCDATE()"),
                        UpdatedById = table.Column<Guid> (nullable: true),
                        UpdatedOn = table.Column<DateTime> (type: "DATETIME2", nullable : true),
                        RowVersion = table.Column<byte[]> (type: "ROWVERSION", nullable : false),
                        ParcelId = table.Column<int> (nullable: false),
                        LocalId = table.Column<int> (nullable: false),
                        Description = table.Column<string> (maxLength: 2000, nullable: true),
                        AddressId = table.Column<int> (nullable: false),
                        Latitude = table.Column<double> (nullable: false),
                        Longitude = table.Column<double> (nullable: false),
                        BuildingConstructionTypeId = table.Column<int> (nullable: false),
                        BuildingFloorCount = table.Column<int> (nullable: false),
                        BuildingPredominateUseId = table.Column<int> (nullable: false),
                        BuildingTenancy = table.Column<string> (maxLength: 100, nullable: false),
                        BuildingNetBookValue = table.Column<float> (nullable: false)
                },
                constraints : table =>
                {
                    table.PrimaryKey ("PK_Buildings", x => x.Id);
                    table.ForeignKey (
                        name: "FK_Buildings_Addresses_AddressId",
                        column : x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Buildings_BuildingConstructionTypes_BuildingConstructionTypeId",
                        column : x => x.BuildingConstructionTypeId,
                        principalTable: "BuildingConstructionTypes",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Buildings_BuildingPredominateUses_BuildingPredominateUseId",
                        column : x => x.BuildingPredominateUseId,
                        principalTable: "BuildingPredominateUses",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Buildings_Users_CreatedById",
                        column : x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Buildings_Parcels_ParcelId",
                        column : x => x.ParcelId,
                        principalTable: "Parcels",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                    table.ForeignKey (
                        name: "FK_Buildings_Users_UpdatedById",
                        column : x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete : ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex (
                name: "IX_Addresses_CityId",
                table: "Addresses",
                column: "CityId");

            migrationBuilder.CreateIndex (
                name: "IX_Addresses_CreatedById",
                table: "Addresses",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Addresses_ProvinceId",
                table: "Addresses",
                column: "ProvinceId");

            migrationBuilder.CreateIndex (
                name: "IX_Addresses_UpdatedById",
                table: "Addresses",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Addresses_Postal_Address1",
                table: "Addresses",
                columns : new [] { "Postal", "Address1" });

            migrationBuilder.CreateIndex (
                name: "IX_BuildingConstructionTypes_CreatedById",
                table: "BuildingConstructionTypes",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_BuildingConstructionTypes_Name",
                table: "BuildingConstructionTypes",
                column: "Name",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_BuildingConstructionTypes_UpdatedById",
                table: "BuildingConstructionTypes",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_BuildingPredominateUses_CreatedById",
                table: "BuildingPredominateUses",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_BuildingPredominateUses_Name",
                table: "BuildingPredominateUses",
                column: "Name",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_BuildingPredominateUses_UpdatedById",
                table: "BuildingPredominateUses",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Buildings_AddressId",
                table: "Buildings",
                column: "AddressId");

            migrationBuilder.CreateIndex (
                name: "IX_Buildings_BuildingConstructionTypeId",
                table: "Buildings",
                column: "BuildingConstructionTypeId");

            migrationBuilder.CreateIndex (
                name: "IX_Buildings_BuildingPredominateUseId",
                table: "Buildings",
                column: "BuildingPredominateUseId");

            migrationBuilder.CreateIndex (
                name: "IX_Buildings_CreatedById",
                table: "Buildings",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Buildings_ParcelId",
                table: "Buildings",
                column: "ParcelId");

            migrationBuilder.CreateIndex (
                name: "IX_Buildings_UpdatedById",
                table: "Buildings",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Buildings_Latitude_Longitude_LocalId_BuildingConstructionTypeId_BuildingPredominateUseId_BuildingFloorCount_BuildingTenancy",
                table: "Buildings",
                columns : new [] { "Latitude", "Longitude", "LocalId", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingFloorCount", "BuildingTenancy" });

            migrationBuilder.CreateIndex (
                name: "IX_Cities_Code",
                table: "Cities",
                column: "Code",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_Cities_CreatedById",
                table: "Cities",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Cities_Name",
                table: "Cities",
                column: "Name");

            migrationBuilder.CreateIndex (
                name: "IX_Cities_UpdatedById",
                table: "Cities",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Parcels_AddressId",
                table: "Parcels",
                column: "AddressId");

            migrationBuilder.CreateIndex (
                name: "IX_Parcels_ClassificationId",
                table: "Parcels",
                column: "ClassificationId");

            migrationBuilder.CreateIndex (
                name: "IX_Parcels_CreatedById",
                table: "Parcels",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Parcels_ParcelId",
                table: "Parcels",
                column: "ParcelId",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_Parcels_StatusId",
                table: "Parcels",
                column: "StatusId");

            migrationBuilder.CreateIndex (
                name: "IX_Parcels_UpdatedById",
                table: "Parcels",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Parcels_Latitude_Longitude_StatusId_ClassificationId_LocalId_AssessedValue_LandArea",
                table: "Parcels",
                columns : new [] { "Latitude", "Longitude", "StatusId", "ClassificationId", "LocalId", "AssessedValue", "LandArea" });

            migrationBuilder.CreateIndex (
                name: "IX_PropertyClassifications_CreatedById",
                table: "PropertyClassifications",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_PropertyClassifications_Name",
                table: "PropertyClassifications",
                column: "Name",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_PropertyClassifications_UpdatedById",
                table: "PropertyClassifications",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_PropertyStatus_CreatedById",
                table: "PropertyStatus",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_PropertyStatus_Name",
                table: "PropertyStatus",
                column: "Name",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_PropertyStatus_UpdatedById",
                table: "PropertyStatus",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_PropertyTypes_CreatedById",
                table: "PropertyTypes",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_PropertyTypes_Name",
                table: "PropertyTypes",
                column: "Name",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_PropertyTypes_UpdatedById",
                table: "PropertyTypes",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Provinces_CreatedById",
                table: "Provinces",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Provinces_Name",
                table: "Provinces",
                column: "Name",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_Provinces_UpdatedById",
                table: "Provinces",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Users_CreatedById",
                table: "Users",
                column: "CreatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique : true);

            migrationBuilder.CreateIndex (
                name: "IX_Users_UpdatedById",
                table: "Users",
                column: "UpdatedById");

            migrationBuilder.CreateIndex (
                name: "IX_Users_LastName_FirstName",
                table: "Users",
                columns : new [] { "LastName", "FirstName" });

            PostDeploy (migrationBuilder);
        }

        protected override void Down (MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable (
                name: "Buildings");

            migrationBuilder.DropTable (
                name: "PropertyTypes");

            migrationBuilder.DropTable (
                name: "BuildingConstructionTypes");

            migrationBuilder.DropTable (
                name: "BuildingPredominateUses");

            migrationBuilder.DropTable (
                name: "Parcels");

            migrationBuilder.DropTable (
                name: "Addresses");

            migrationBuilder.DropTable (
                name: "PropertyClassifications");

            migrationBuilder.DropTable (
                name: "PropertyStatus");

            migrationBuilder.DropTable (
                name: "Cities");

            migrationBuilder.DropTable (
                name: "Provinces");

            migrationBuilder.DropTable (
                name: "Users");
        }
    }
}
