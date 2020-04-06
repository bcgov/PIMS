using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal.Migrations
{
    public partial class Initial : SeedMigration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            PreDeploy(migrationBuilder);
            
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Username = table.Column<string>(maxLength: 25, nullable: false),
                    DisplayName = table.Column<string>(maxLength: 100, nullable: false),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    MiddleName = table.Column<string>(maxLength: 100, nullable: true),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    Email = table.Column<string>(maxLength: 100, nullable: false),
                    Position = table.Column<string>(maxLength: 100, nullable: true),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    EmailVerified = table.Column<bool>(nullable: false, defaultValue: false),
                    Note = table.Column<string>(maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AccessRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    IsDisabled = table.Column<bool>(nullable: false),
                    IsGranted = table.Column<bool>(nullable: true),
                    UserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AccessRequests_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequests_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Agencies",
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
                    Code = table.Column<string>(maxLength: 6, nullable: false),
                    Description = table.Column<string>(maxLength: 500, nullable: true),
                    ParentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agencies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Agencies_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Agencies_Agencies_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Agencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Agencies_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BuildingConstructionTypes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingConstructionTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BuildingConstructionTypes_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingConstructionTypes_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BuildingOccupantTypes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingOccupantTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BuildingOccupantTypes_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingOccupantTypes_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BuildingPredominateUses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingPredominateUses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BuildingPredominateUses_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingPredominateUses_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Cities",
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
                    Code = table.Column<string>(maxLength: 4, nullable: false)
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

            migrationBuilder.CreateTable(
                name: "Claims",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Description = table.Column<string>(maxLength: 500, nullable: true),
                    IsDisabled = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Claims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Claims_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Claims_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PropertyClassifications",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyClassifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyClassifications_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyClassifications_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PropertyStatus",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyStatus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyStatus_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyStatus_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PropertyTypes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyTypes_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyTypes_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Provinces",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 2, nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Provinces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Provinces_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Provinces_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false),
                    SortOrder = table.Column<int>(nullable: false),
                    Description = table.Column<string>(maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Roles_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Roles_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AccessRequestAgencies",
                columns: table => new
                {
                    AccessRequestId = table.Column<Guid>(nullable: false),
                    AgencyId = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessRequestAgencies", x => new { x.AccessRequestId, x.AgencyId });
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_AccessRequests_AccessRequestId",
                        column: x => x.AccessRequestId,
                        principalTable: "AccessRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_Agencies_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "Agencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestAgencies_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserAgencies",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    AgencyId = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAgencies", x => new { x.UserId, x.AgencyId });
                    table.ForeignKey(
                        name: "FK_UserAgencies_Agencies_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "Agencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserAgencies_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserAgencies_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserAgencies_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Address1 = table.Column<string>(maxLength: 150, nullable: true),
                    Address2 = table.Column<string>(maxLength: 150, nullable: true),
                    CityId = table.Column<int>(nullable: false),
                    ProvinceId = table.Column<string>(maxLength: 2, nullable: false),
                    Postal = table.Column<string>(maxLength: 6, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Addresses_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Addresses_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Addresses_Provinces_ProvinceId",
                        column: x => x.ProvinceId,
                        principalTable: "Provinces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Addresses_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AccessRequestRoles",
                columns: table => new
                {
                    AccessRequestId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessRequestRoles", x => new { x.AccessRequestId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_AccessRequests_AccessRequestId",
                        column: x => x.AccessRequestId,
                        principalTable: "AccessRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccessRequestRoles_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(nullable: false),
                    ClaimId = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => new { x.RoleId, x.ClaimId });
                    table.ForeignKey(
                        name: "FK_RoleClaims_Claims_ClaimId",
                        column: x => x.ClaimId,
                        principalTable: "Claims",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Parcels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    PID = table.Column<int>(nullable: false),
                    PIN = table.Column<int>(nullable: true),
                    StatusId = table.Column<int>(nullable: false),
                    ClassificationId = table.Column<int>(nullable: false),
                    AgencyId = table.Column<int>(nullable: false),
                    Description = table.Column<string>(maxLength: 2000, nullable: true),
                    AddressId = table.Column<int>(nullable: false),
                    Latitude = table.Column<double>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    LandArea = table.Column<float>(nullable: false),
                    LandLegalDescription = table.Column<string>(maxLength: 500, nullable: true),
                    Zoning = table.Column<string>(maxLength: 500, nullable: true),
                    ZoningPotential = table.Column<bool>(maxLength: 500, nullable: false),
                    IsSensitive = table.Column<bool>(nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parcels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Parcels_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Parcels_Agencies_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "Agencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Parcels_PropertyClassifications_ClassificationId",
                        column: x => x.ClassificationId,
                        principalTable: "PropertyClassifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Parcels_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Parcels_PropertyStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "PropertyStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Parcels_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Buildings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    ParcelId = table.Column<int>(nullable: false),
                    LocalId = table.Column<string>(maxLength: 50, nullable: true),
                    Description = table.Column<string>(maxLength: 2000, nullable: true),
                    AddressId = table.Column<int>(nullable: false),
                    Latitude = table.Column<double>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    BuildingConstructionTypeId = table.Column<int>(nullable: false),
                    BuildingFloorCount = table.Column<int>(nullable: false),
                    BuildingPredominateUseId = table.Column<int>(nullable: false),
                    BuildingTenancy = table.Column<string>(maxLength: 100, nullable: false),
                    RentableArea = table.Column<float>(nullable: false),
                    AgencyId = table.Column<int>(nullable: false),
                    BuildingOccupantTypeId = table.Column<int>(nullable: false),
                    LeaseExpiry = table.Column<DateTime>(nullable: true),
                    OccupantName = table.Column<string>(maxLength: 100, nullable: true),
                    TransferLeaseOnSale = table.Column<bool>(nullable: false),
                    IsSensitive = table.Column<bool>(nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buildings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Buildings_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buildings_Agencies_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "Agencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buildings_BuildingConstructionTypes_BuildingConstructionTypeId",
                        column: x => x.BuildingConstructionTypeId,
                        principalTable: "BuildingConstructionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buildings_BuildingOccupantTypes_BuildingOccupantTypeId",
                        column: x => x.BuildingOccupantTypeId,
                        principalTable: "BuildingOccupantTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buildings_BuildingPredominateUses_BuildingPredominateUseId",
                        column: x => x.BuildingPredominateUseId,
                        principalTable: "BuildingPredominateUses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buildings_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buildings_Parcels_ParcelId",
                        column: x => x.ParcelId,
                        principalTable: "Parcels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buildings_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ParcelEvaluations",
                columns: table => new
                {
                    FiscalYear = table.Column<int>(nullable: false),
                    ParcelId = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    EstimatedValue = table.Column<decimal>(type: "MONEY", nullable: false),
                    AppraisedValue = table.Column<decimal>(type: "MONEY", nullable: false),
                    AssessedValue = table.Column<decimal>(type: "MONEY", nullable: false),
                    NetBookValue = table.Column<decimal>(type: "MONEY", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParcelEvaluations", x => new { x.FiscalYear, x.ParcelId });
                    table.ForeignKey(
                        name: "FK_ParcelEvaluations_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelEvaluations_Parcels_ParcelId",
                        column: x => x.ParcelId,
                        principalTable: "Parcels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParcelEvaluations_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BuildingEvaluations",
                columns: table => new
                {
                    FiscalYear = table.Column<int>(nullable: false),
                    BuildingId = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedById = table.Column<Guid>(nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    EstimatedValue = table.Column<decimal>(type: "MONEY", nullable: false),
                    AppraisedValue = table.Column<decimal>(type: "MONEY", nullable: false),
                    AssessedValue = table.Column<decimal>(type: "MONEY", nullable: false),
                    NetBookValue = table.Column<decimal>(type: "MONEY", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingEvaluations", x => new { x.FiscalYear, x.BuildingId });
                    table.ForeignKey(
                        name: "FK_BuildingEvaluations_Buildings_BuildingId",
                        column: x => x.BuildingId,
                        principalTable: "Buildings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingEvaluations_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingEvaluations_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestAgencies_AgencyId",
                table: "AccessRequestAgencies",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestAgencies_CreatedById",
                table: "AccessRequestAgencies",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestAgencies_UpdatedById",
                table: "AccessRequestAgencies",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestRoles_CreatedById",
                table: "AccessRequestRoles",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestRoles_RoleId",
                table: "AccessRequestRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequestRoles_UpdatedById",
                table: "AccessRequestRoles",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_CreatedById",
                table: "AccessRequests",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_UpdatedById",
                table: "AccessRequests",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_UserId",
                table: "AccessRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessRequests_IsDisabled_IsGranted",
                table: "AccessRequests",
                columns: new[] { "IsDisabled", "IsGranted" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_CityId",
                table: "Addresses",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_CreatedById",
                table: "Addresses",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ProvinceId",
                table: "Addresses",
                column: "ProvinceId");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_UpdatedById",
                table: "Addresses",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Postal_Address1",
                table: "Addresses",
                columns: new[] { "Postal", "Address1" });

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_CreatedById",
                table: "Agencies",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_ParentId",
                table: "Agencies",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_UpdatedById",
                table: "Agencies",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_Code_ParentId",
                table: "Agencies",
                columns: new[] { "Code", "ParentId" },
                unique: true,
                filter: "[ParentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_IsDisabled_Code_Name_ParentId_SortOrder",
                table: "Agencies",
                columns: new[] { "IsDisabled", "Code", "Name", "ParentId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingConstructionTypes_CreatedById",
                table: "BuildingConstructionTypes",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingConstructionTypes_Name",
                table: "BuildingConstructionTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BuildingConstructionTypes_UpdatedById",
                table: "BuildingConstructionTypes",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingConstructionTypes_IsDisabled_Name_SortOrder",
                table: "BuildingConstructionTypes",
                columns: new[] { "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingEvaluations_BuildingId",
                table: "BuildingEvaluations",
                column: "BuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingEvaluations_CreatedById",
                table: "BuildingEvaluations",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingEvaluations_UpdatedById",
                table: "BuildingEvaluations",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingEvaluations_AssessedValue_EstimatedValue_NetBookValue",
                table: "BuildingEvaluations",
                columns: new[] { "AssessedValue", "EstimatedValue", "NetBookValue" });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingOccupantTypes_CreatedById",
                table: "BuildingOccupantTypes",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingOccupantTypes_Name",
                table: "BuildingOccupantTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BuildingOccupantTypes_UpdatedById",
                table: "BuildingOccupantTypes",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingOccupantTypes_IsDisabled_Name_SortOrder",
                table: "BuildingOccupantTypes",
                columns: new[] { "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingPredominateUses_CreatedById",
                table: "BuildingPredominateUses",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingPredominateUses_Name",
                table: "BuildingPredominateUses",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BuildingPredominateUses_UpdatedById",
                table: "BuildingPredominateUses",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingPredominateUses_IsDisabled_Name_SortOrder",
                table: "BuildingPredominateUses",
                columns: new[] { "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_AddressId",
                table: "Buildings",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_AgencyId",
                table: "Buildings",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_BuildingConstructionTypeId",
                table: "Buildings",
                column: "BuildingConstructionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_BuildingOccupantTypeId",
                table: "Buildings",
                column: "BuildingOccupantTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_BuildingPredominateUseId",
                table: "Buildings",
                column: "BuildingPredominateUseId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_CreatedById",
                table: "Buildings",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_ParcelId",
                table: "Buildings",
                column: "ParcelId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_UpdatedById",
                table: "Buildings",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_Latitude_Longitude_LocalId_IsSensitive_AgencyId_BuildingConstructionTypeId_BuildingPredominateUseId_BuildingOccupa~",
                table: "Buildings",
                columns: new[] { "Latitude", "Longitude", "LocalId", "IsSensitive", "AgencyId", "BuildingConstructionTypeId", "BuildingPredominateUseId", "BuildingOccupantTypeId", "BuildingFloorCount", "BuildingTenancy" });

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
                name: "IX_Cities_IsDisabled_Name_SortOrder",
                table: "Cities",
                columns: new[] { "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Claims_CreatedById",
                table: "Claims",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_Name",
                table: "Claims",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Claims_UpdatedById",
                table: "Claims",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_IsDisabled_Name",
                table: "Claims",
                columns: new[] { "IsDisabled", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_ParcelEvaluations_CreatedById",
                table: "ParcelEvaluations",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelEvaluations_ParcelId",
                table: "ParcelEvaluations",
                column: "ParcelId");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelEvaluations_UpdatedById",
                table: "ParcelEvaluations",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ParcelEvaluations_AssessedValue_EstimatedValue_NetBookValue",
                table: "ParcelEvaluations",
                columns: new[] { "AssessedValue", "EstimatedValue", "NetBookValue" });

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_AddressId",
                table: "Parcels",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_AgencyId",
                table: "Parcels",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_ClassificationId",
                table: "Parcels",
                column: "ClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_CreatedById",
                table: "Parcels",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_StatusId",
                table: "Parcels",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_UpdatedById",
                table: "Parcels",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_PID_PIN",
                table: "Parcels",
                columns: new[] { "PID", "PIN" },
                unique: true,
                filter: "[PIN] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Parcels_Latitude_Longitude_StatusId_IsSensitive_AgencyId_ClassificationId_LandArea",
                table: "Parcels",
                columns: new[] { "Latitude", "Longitude", "StatusId", "IsSensitive", "AgencyId", "ClassificationId", "LandArea" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClassifications_CreatedById",
                table: "PropertyClassifications",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClassifications_Name",
                table: "PropertyClassifications",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClassifications_UpdatedById",
                table: "PropertyClassifications",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClassifications_IsDisabled_Name",
                table: "PropertyClassifications",
                columns: new[] { "IsDisabled", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyStatus_CreatedById",
                table: "PropertyStatus",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyStatus_Name",
                table: "PropertyStatus",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyStatus_UpdatedById",
                table: "PropertyStatus",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyStatus_IsDisabled_Name_SortOrder",
                table: "PropertyStatus",
                columns: new[] { "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyTypes_CreatedById",
                table: "PropertyTypes",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyTypes_Name",
                table: "PropertyTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyTypes_UpdatedById",
                table: "PropertyTypes",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyTypes_IsDisabled_Name_SortOrder",
                table: "PropertyTypes",
                columns: new[] { "IsDisabled", "Name", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Provinces_CreatedById",
                table: "Provinces",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Provinces_Name",
                table: "Provinces",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Provinces_UpdatedById",
                table: "Provinces",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_ClaimId",
                table: "RoleClaims",
                column: "ClaimId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_CreatedById",
                table: "RoleClaims",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_UpdatedById",
                table: "RoleClaims",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_CreatedById",
                table: "Roles",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_UpdatedById",
                table: "Roles",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_IsDisabled_Name",
                table: "Roles",
                columns: new[] { "IsDisabled", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_UserAgencies_AgencyId",
                table: "UserAgencies",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAgencies_CreatedById",
                table: "UserAgencies",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_UserAgencies_UpdatedById",
                table: "UserAgencies",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_CreatedById",
                table: "UserRoles",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UpdatedById",
                table: "UserRoles",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CreatedById",
                table: "Users",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_UpdatedById",
                table: "Users",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsDisabled_LastName_FirstName",
                table: "Users",
                columns: new[] { "IsDisabled", "LastName", "FirstName" });
        
            PostDeploy(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessRequestAgencies");

            migrationBuilder.DropTable(
                name: "AccessRequestRoles");

            migrationBuilder.DropTable(
                name: "BuildingEvaluations");

            migrationBuilder.DropTable(
                name: "ParcelEvaluations");

            migrationBuilder.DropTable(
                name: "PropertyTypes");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "UserAgencies");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "AccessRequests");

            migrationBuilder.DropTable(
                name: "Buildings");

            migrationBuilder.DropTable(
                name: "Claims");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "BuildingConstructionTypes");

            migrationBuilder.DropTable(
                name: "BuildingOccupantTypes");

            migrationBuilder.DropTable(
                name: "BuildingPredominateUses");

            migrationBuilder.DropTable(
                name: "Parcels");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "Agencies");

            migrationBuilder.DropTable(
                name: "PropertyClassifications");

            migrationBuilder.DropTable(
                name: "PropertyStatus");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropTable(
                name: "Provinces");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
