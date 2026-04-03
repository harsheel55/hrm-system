using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendanceTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Attendances",
                columns: table => new
                {
                    strAttendanceGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    strUserGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    dtDate = table.Column<DateOnly>(type: "date", nullable: false),
                    dtCheckIn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    dtCheckOut = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    strRemarks = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendances", x => x.strAttendanceGUID);
                    table.ForeignKey(
                        name: "FK_Attendances_Users_strUserGUID",
                        column: x => x.strUserGUID,
                        principalTable: "Users",
                        principalColumn: "strUserGUID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "strUserRoleGUID", "bolIsActive", "bolSystemCreated", "dtCreatedOn", "dtUpdatedOn", "strCreatedByGUID", "strDesc", "strRoleName", "strUpdatedByGUID" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), true, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "System Administrator with full access", "Super Admin", null },
                    { new Guid("22222222-2222-2222-2222-222222222222"), true, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Human Resources with management access", "HR", null },
                    { new Guid("33333333-3333-3333-3333-333333333333"), true, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Standard employee access", "Employee", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_strUserGUID",
                table: "Attendances",
                column: "strUserGUID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attendances");

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumn: "strUserRoleGUID",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumn: "strUserRoleGUID",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumn: "strUserRoleGUID",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));
        }
    }
}
