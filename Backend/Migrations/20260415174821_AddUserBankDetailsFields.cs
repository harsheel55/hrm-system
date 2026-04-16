using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserBankDetailsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "mstBlog");

            migrationBuilder.DropTable(
                name: "mstBlogTag");

            migrationBuilder.DropTable(
                name: "mstBlogCategory");

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumn: "strUserRoleGUID",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.AddColumn<string>(
                name: "strBankAccountNo",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "strBankName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "strTaxBracket",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "strBankAccountNo",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "strBankName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "strTaxBracket",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "mstBlogCategory",
                columns: table => new
                {
                    strCategoryGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    intDisplayOrder = table.Column<int>(type: "int", nullable: false),
                    strCategoryDescription = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    strCategoryImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strCategoryName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    strCategorySlug = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    strCreatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    strMetaDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaKeywords = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    strUpdatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mstBlogCategory", x => x.strCategoryGUID);
                });

            migrationBuilder.CreateTable(
                name: "mstBlogTag",
                columns: table => new
                {
                    strTagGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strCreatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    strTagName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    strTagSlug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    strUpdatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mstBlogTag", x => x.strTagGUID);
                });

            migrationBuilder.CreateTable(
                name: "mstBlog",
                columns: table => new
                {
                    strBlogGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: false),
                    CategorystrCategoryGUID = table.Column<string>(type: "nvarchar(36)", nullable: true),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    bolIsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    bolIsPublished = table.Column<bool>(type: "bit", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dtPublishDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strBlogSlug = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    strBlogTitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    strCategoryGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    strCreatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    strFeaturedImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strFullContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    strMetaDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaKeywords = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    strShortDescription = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    strUpdatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mstBlog", x => x.strBlogGUID);
                    table.ForeignKey(
                        name: "FK_mstBlog_mstBlogCategory_CategorystrCategoryGUID",
                        column: x => x.CategorystrCategoryGUID,
                        principalTable: "mstBlogCategory",
                        principalColumn: "strCategoryGUID");
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

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "strUserRoleGUID", "bolIsActive", "bolSystemCreated", "dtCreatedOn", "dtUpdatedOn", "strCreatedByGUID", "strDesc", "strRoleName", "strUpdatedByGUID" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), true, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "System Administrator with full access", "Super Admin", null });

            migrationBuilder.CreateIndex(
                name: "IX_mstBlog_CategorystrCategoryGUID",
                table: "mstBlog",
                column: "CategorystrCategoryGUID");
        }
    }
}
