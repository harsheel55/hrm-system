using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedDefaultShifts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Shifts",
                columns: new[] { "strShiftGUID", "bolIsActive", "dtCreatedOn", "dtUpdatedOn", "strColor", "strName", "tEndTime", "tStartTime" },
                values: new object[,]
                {
                    { new Guid("e1a1a1a1-1111-1111-1111-111111111111"), true, new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4178), new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4181), "#fbbf24", "Morning Shift", new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0) },
                    { new Guid("e2a2a2a2-2222-2222-2222-222222222222"), true, new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4205), new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4205), "#3b82f6", "Afternoon Shift", new TimeSpan(0, 0, 0, 0, 0), new TimeSpan(0, 16, 0, 0, 0) },
                    { new Guid("e3a3a3a3-3333-3333-3333-333333333333"), true, new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4209), new DateTime(2026, 4, 3, 17, 35, 58, 17, DateTimeKind.Utc).AddTicks(4209), "#8b5cf6", "Night Shift", new TimeSpan(0, 8, 0, 0, 0), new TimeSpan(0, 0, 0, 0, 0) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"));
        }
    }
}
