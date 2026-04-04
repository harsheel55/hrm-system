using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPayrollTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PayrollCompliances",
                columns: table => new
                {
                    strComplianceGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strAuthority = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strCategory = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtDueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    decAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    strPeriod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strFilingReference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtCreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    dtFiledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    bitIsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayrollCompliances", x => x.strComplianceGUID);
                });

            migrationBuilder.CreateTable(
                name: "PayrollEmployees",
                columns: table => new
                {
                    strPayrollEmployeeGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strUserGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strPayPeriod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strEmploymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    decBaseSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decHRA = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decTransportAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decMedicalAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decPerformanceBonus = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decGrossEarnings = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decProvidentFund = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decIncomeTax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decHealthInsurance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decTotalDeductions = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decNetPay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    strBankLast4 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strBankName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strTaxBracket = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    decYTDGross = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decYTDTax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    dtCreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    bitIsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayrollEmployees", x => x.strPayrollEmployeeGUID);
                    table.ForeignKey(
                        name: "FK_PayrollEmployees_Users_strUserGUID",
                        column: x => x.strUserGUID,
                        principalTable: "Users",
                        principalColumn: "strUserGUID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PayrollRuns",
                columns: table => new
                {
                    strPayrollRunGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strRunID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strPayPeriod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    intEmployeeCount = table.Column<int>(type: "int", nullable: false),
                    decTotalGross = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decTotalDeductions = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    decTotalNetPay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    strInitiatedByUserGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtInitiatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtPaidAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strStepsJSON = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtCreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    bitIsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayrollRuns", x => x.strPayrollRunGUID);
                    table.ForeignKey(
                        name: "FK_PayrollRuns_Users_strInitiatedByUserGUID",
                        column: x => x.strInitiatedByUserGUID,
                        principalTable: "Users",
                        principalColumn: "strUserGUID");
                });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e1a1a1a1-1111-1111-1111-111111111111"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 19, 41, 16, 969, DateTimeKind.Utc).AddTicks(4664), new DateTime(2026, 4, 3, 19, 41, 16, 969, DateTimeKind.Utc).AddTicks(4670) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e2a2a2a2-2222-2222-2222-222222222222"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 19, 41, 16, 969, DateTimeKind.Utc).AddTicks(4693), new DateTime(2026, 4, 3, 19, 41, 16, 969, DateTimeKind.Utc).AddTicks(4694) });

            migrationBuilder.UpdateData(
                table: "Shifts",
                keyColumn: "strShiftGUID",
                keyValue: new Guid("e3a3a3a3-3333-3333-3333-333333333333"),
                columns: new[] { "dtCreatedOn", "dtUpdatedOn" },
                values: new object[] { new DateTime(2026, 4, 3, 19, 41, 16, 969, DateTimeKind.Utc).AddTicks(4700), new DateTime(2026, 4, 3, 19, 41, 16, 969, DateTimeKind.Utc).AddTicks(4700) });

            migrationBuilder.CreateIndex(
                name: "IX_PayrollEmployees_strUserGUID",
                table: "PayrollEmployees",
                column: "strUserGUID");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollRuns_strInitiatedByUserGUID",
                table: "PayrollRuns",
                column: "strInitiatedByUserGUID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PayrollCompliances");

            migrationBuilder.DropTable(
                name: "PayrollEmployees");

            migrationBuilder.DropTable(
                name: "PayrollRuns");

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
        }
    }
}
