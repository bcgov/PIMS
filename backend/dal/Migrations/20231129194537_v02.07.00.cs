﻿using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

#nullable disable

namespace Pims.Dal.Migrations
{
    public partial class v020700 : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreUp(migrationBuilder);

            PostUp(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            PreDown(migrationBuilder);

            PostDown(migrationBuilder);
        }
    }
}
