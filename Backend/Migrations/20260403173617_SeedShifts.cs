using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedShifts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 17, 36, 16, 714, DateTimeKind.Utc).AddTicks(6567), new DateTime(2026, 4, 3, 17, 36, 16, 714, DateTimeKind.Utc).AddTicks(6569) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 17, 36, 16, 714, DateTimeKind.Utc).AddTicks(6589), new DateTime(2026, 4, 3, 17, 36, 16, 714, DateTimeKind.Utc).AddTicks(6589) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 17, 36, 16, 714, DateTimeKind.Utc).AddTicks(6592), new DateTime(2026, 4, 3, 17, 36, 16, 714, DateTimeKind.Utc).AddTicks(6593) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4178), new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4181) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4205), new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4205) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4209), new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4209) });
        }
    }
}
