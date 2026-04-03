using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddShiftTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Shifts",
                columns: table => new
                {
                    strShiftGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    strName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    tStartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    tEndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    strColor = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shifts", x => x.strShiftGUID);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeShifts",
                columns: table => new
                {
                    strEmployeeShiftGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    strUserGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strShiftGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    dtDate = table.Column<DateOnly>(type: "date", nullable: false),
                    strNotes = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeShifts", x => x.strEmployeeShiftGUID);
                    table.ForeignKey(
                        name: "FK_EmployeeShifts_Shifts_strShiftGUID",
                        column: x => x.strShiftGUID,
                        principalTable: "Shifts",
                        principalColumn: "strShiftGUID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeShifts_Users_strUserGUID",
                        column: x => x.strUserGUID,
                        principalTable: "Users",
                        principalColumn: "strUserGUID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeShifts_strShiftGUID",
                table: "EmployeeShifts",
                column: "strShiftGUID");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeShifts_strUserGUID",
                table: "EmployeeShifts",
                column: "strUserGUID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmployeeShifts");

            migrationBuilder.DropTable(
                name: "Shifts");
        }
    }
}
