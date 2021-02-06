using System;
using Pims.Dal.Helpers.Migrations;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010701 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
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
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.DropTable(
                name: "ParcelParcels");
            PostDown(migrationBuilder);
        }
    }
}
