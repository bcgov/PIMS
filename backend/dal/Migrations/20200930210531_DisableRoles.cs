using Microsoft.EntityFrameworkCore.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class DisableRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE dbo.Roles SET IsDisabled = 1 WHERE Name in ('Assistant Deputy Minister', 'Assistant Deputy Minister Assistant', 'Executive Director')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE dbo.Roles SET IsDisabled = 0 WHERE Name in ('Assistant Deputy Minister', 'Assistant Deputy Minister Assistant', 'Executive Director')");
        }
    }
}


