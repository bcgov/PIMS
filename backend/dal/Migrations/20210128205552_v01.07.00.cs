using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;
using System;

namespace Pims.Dal.Migrations
{
    public partial class v010700 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.AddColumn<int>(
                name: "PropertyTypeId",
                table: "Parcels",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PropertyTypeId",
                table: "Buildings",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateTable(
                name: "ParcelParcels",
                columns: table => new
                {
                    ParcelId = table.Column<int>(nullable: false),
                    SubdivisionId = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParcelParcels", x => new { x.ParcelId, x.SubdivisionId });
                    table.ForeignKey(
                        name: "FK_ParcelParcels_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelParcels_Parcels_ParcelId",
                        column: x => x.ParcelId,
                        principalTable: "Parcels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelParcels_Parcels_SubdivisionId",
                        column: x => x.SubdivisionId,
                        principalTable: "Parcels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelParcels_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_PropertyTypeId",
                table: "Parcels",
                column: "PropertyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_PropertyTypeId",
                table: "Buildings",
                column: "PropertyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelParcels_CreatedById",
                table: "ParcelParcels",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelParcels_SubdivisionId",
                table: "ParcelParcels",
                column: "SubdivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelParcels_UpdatedById",
                table: "ParcelParcels",
                column: "UpdatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Buildings_PropertyTypes_PropertyTypeId",
                table: "Buildings",
                column: "PropertyTypeId",
                principalTable: "PropertyTypes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Parcels_PropertyTypes_PropertyTypeId",
                table: "Parcels",
                column: "PropertyTypeId",
                principalTable: "PropertyTypes",
                principalColumn: "Id");
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropForeignKey(
                name: "FK_Buildings_PropertyTypes_PropertyTypeId",
                table: "Buildings");

            migrationBuilder.DropForeignKey(
                name: "FK_Parcels_PropertyTypes_PropertyTypeId",
                table: "Parcels");

            migrationBuilder.DropTable(
                name: "ParcelParcels");

            migrationBuilder.DropIndex(
                name: "IX_Parcels_PropertyTypeId",
                table: "Parcels");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_PropertyTypeId",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "PropertyTypeId",
                table: "Parcels");

            migrationBuilder.DropColumn(
                name: "PropertyTypeId",
                table: "Buildings");
            PostDown(migrationBuilder);
        }
    }
}
