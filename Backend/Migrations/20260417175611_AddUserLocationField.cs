using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserLocationField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "strLocation",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 17, 17, 56, 10, 509, DateTimeKind.Utc).AddTicks(6282), new DateTime(2026, 4, 17, 17, 56, 10, 509, DateTimeKind.Utc).AddTicks(6286) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 17, 17, 56, 10, 509, DateTimeKind.Utc).AddTicks(6299), new DateTime(2026, 4, 17, 17, 56, 10, 509, DateTimeKind.Utc).AddTicks(6299) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 17, 17, 56, 10, 509, DateTimeKind.Utc).AddTicks(6302), new DateTime(2026, 4, 17, 17, 56, 10, 509, DateTimeKind.Utc).AddTicks(6302) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "strLocation",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 15, 17, 48, 20, 756, DateTimeKind.Utc).AddTicks(5260), new DateTime(2026, 4, 15, 17, 48, 20, 756, DateTimeKind.Utc).AddTicks(5264) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 15, 17, 48, 20, 756, DateTimeKind.Utc).AddTicks(5302), new DateTime(2026, 4, 15, 17, 48, 20, 756, DateTimeKind.Utc).AddTicks(5303) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 15, 17, 48, 20, 756, DateTimeKind.Utc).AddTicks(5310), new DateTime(2026, 4, 15, 17, 48, 20, 756, DateTimeKind.Utc).AddTicks(5310) });
        }
    }
}
