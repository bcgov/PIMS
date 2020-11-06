using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class v010201 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);
            migrationBuilder.DropIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstructionType~",
                table: "Buildings");
            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);
            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Id_IsSensitive_AgencyId_ClassificationId_AddressId_ProjectNumber_BuildingPredominateUseId_BuildingConstructionType~",
                table: "Buildings",
                columns: new[] { "Id", "IsSensitive", "AgencyId", "ClassificationId", "AddressId", "ProjectNumber", "BuildingPredominateUseId", "BuildingConstructionTypeId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });
            PostDown(migrationBuilder);
        }
    }
}
