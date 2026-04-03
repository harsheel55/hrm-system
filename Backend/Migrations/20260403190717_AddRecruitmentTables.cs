using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRecruitmentTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PerformanceGoals");

            migrationBuilder.DropTable(
                name: "PerformanceReviews");

            migrationBuilder.CreateTable(
                name: "RecruitmentJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    JobType = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    HiringManager = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Salary = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    SkillsCsv = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResponsibilitiesCsv = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    PostedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClosingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecruitmentJobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RecruitmentCandidates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Stage = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    AppliedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Experience = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Source = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecruitmentCandidates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecruitmentCandidates_RecruitmentJobs_JobId",
                        column: x => x.JobId,
                        principalTable: "RecruitmentJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 19, 7, 17, 354, DateTimeKind.Utc).AddTicks(174), new DateTime(2026, 4, 3, 19, 7, 17, 354, DateTimeKind.Utc).AddTicks(179) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 19, 7, 17, 354, DateTimeKind.Utc).AddTicks(195), new DateTime(2026, 4, 3, 19, 7, 17, 354, DateTimeKind.Utc).AddTicks(195) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 19, 7, 17, 354, DateTimeKind.Utc).AddTicks(198), new DateTime(2026, 4, 3, 19, 7, 17, 354, DateTimeKind.Utc).AddTicks(199) });

            migrationBuilder.CreateIndex(
                name: "IX_RecruitmentCandidates_JobId",
                table: "RecruitmentCandidates",
                column: "JobId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecruitmentCandidates");

            migrationBuilder.DropTable(
                name: "RecruitmentJobs");

            migrationBuilder.CreateTable(
                name: "PerformanceGoals",
                columns: table => new
                {
                    strGoalGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    strEmployeeGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    dtDueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    nProgress = table.Column<int>(type: "int", nullable: false),
                    strDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strTitle = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    dtReviewDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    nRating = table.Column<int>(type: "int", nullable: false),
                    strComments = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strPeriod = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
    }
}
