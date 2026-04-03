using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PerformanceGoals",
                columns: table => new
                {
                    strGoalGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    strEmployeeGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nProgress = table.Column<int>(type: "int", nullable: false),
                    dtDueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformanceGoals", x => x.strGoalGUID);
                    table.ForeignKey(
                        name: "FK_PerformanceGoals_Users_strEmployeeGUID",
                        column: x => x.strEmployeeGUID,
                        principalTable: "Users",
                        principalColumn: "strUserGUID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PerformanceReviews",
                columns: table => new
                {
                    strReviewGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    strEmployeeGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strReviewerGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    nRating = table.Column<int>(type: "int", nullable: false),
                    strComments = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strPeriod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtReviewDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformanceReviews", x => x.strReviewGUID);
                    table.ForeignKey(
                        name: "FK_PerformanceReviews_Users_strEmployeeGUID",
                        column: x => x.strEmployeeGUID,
                        principalTable: "Users",
                        principalColumn: "strUserGUID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PerformanceReviews_Users_strReviewerGUID",
                        column: x => x.strReviewerGUID,
                        principalTable: "Users",
                        principalColumn: "strUserGUID");
                });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 18, 16, 59, 499, DateTimeKind.Utc).AddTicks(289), new DateTime(2026, 4, 3, 18, 16, 59, 499, DateTimeKind.Utc).AddTicks(292) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 18, 16, 59, 499, DateTimeKind.Utc).AddTicks(308), new DateTime(2026, 4, 3, 18, 16, 59, 499, DateTimeKind.Utc).AddTicks(309) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 18, 16, 59, 499, DateTimeKind.Utc).AddTicks(312), new DateTime(2026, 4, 3, 18, 16, 59, 499, DateTimeKind.Utc).AddTicks(312) });

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceGoals_strEmployeeGUID",
                table: "PerformanceGoals",
                column: "strEmployeeGUID");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceReviews_strEmployeeGUID",
                table: "PerformanceReviews",
                column: "strEmployeeGUID");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceReviews_strReviewerGUID",
                table: "PerformanceReviews",
                column: "strReviewerGUID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PerformanceGoals");

            migrationBuilder.DropTable(
                name: "PerformanceReviews");

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
    }
}
