using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Login",
                columns: table => new
                {
                    email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    pass = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Login", x => x.email);
                });

            migrationBuilder.CreateTable(
                name: "Menus",
                columns: table => new
                {
                    strMenuGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strParentMenuGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    strMenuName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dblSeqNo = table.Column<double>(type: "float", nullable: false),
                    strPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strMapKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strMenuPositions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bolHasSubMenu = table.Column<bool>(type: "bit", nullable: false),
                    strIconName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    strCreatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strUpdatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtUpdateOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menus", x => x.strMenuGUID);
                });

            migrationBuilder.CreateTable(
                name: "mstBlogCategory",
                columns: table => new
                {
                    strCategoryGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: false),
                    strCategoryName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    strCategorySlug = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    strCategoryDescription = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    strCategoryImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    strMetaDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaKeywords = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    intDisplayOrder = table.Column<int>(type: "int", nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    strCreatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strUpdatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                    strTagName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    strTagSlug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    strCreatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strUpdatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mstBlogTag", x => x.strTagGUID);
                });

            migrationBuilder.CreateTable(
                name: "Registers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRights",
                columns: table => new
                {
                    strUserRightGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strUserRoleGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strMenuGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    bolCanView = table.Column<bool>(type: "bit", nullable: false),
                    bolCanEdit = table.Column<bool>(type: "bit", nullable: false),
                    bolCanSave = table.Column<bool>(type: "bit", nullable: false),
                    bolCanDelete = table.Column<bool>(type: "bit", nullable: false),
                    bolCanPrint = table.Column<bool>(type: "bit", nullable: false),
                    bolCanExport = table.Column<bool>(type: "bit", nullable: false),
                    bolCanImport = table.Column<bool>(type: "bit", nullable: false),
                    bolCanApprove = table.Column<bool>(type: "bit", nullable: false),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strCreatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strUpdatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRights", x => x.strUserRightGUID);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    strUserRoleGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strRoleName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strDesc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    bolSystemCreated = table.Column<bool>(type: "bit", nullable: false),
                    strCreatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strUpdatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.strUserRoleGUID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    strUserGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    strUserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strPassword = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strPhoneNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dDob = table.Column<DateTime>(type: "datetime2", nullable: true),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    bolSystemCreated = table.Column<bool>(type: "bit", nullable: false),
                    strRoleGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    strOTP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtOTPExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strRefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtRefreshTokenExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strPreferredLanguage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    strProfileImg = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dtLastLogin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    strCreatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strUpdatedByGUID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.strUserGUID);
                });

            migrationBuilder.CreateTable(
                name: "mstBlog",
                columns: table => new
                {
                    strBlogGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: false),
                    strCategoryGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    strBlogSlug = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    strBlogTitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    strShortDescription = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    strFullContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    strFeaturedImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    strMetaDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    strMetaKeywords = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    dtPublishDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    bolIsPublished = table.Column<bool>(type: "bit", nullable: false),
                    bolIsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    bolIsActive = table.Column<bool>(type: "bit", nullable: false),
                    strCreatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    dtCreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    strUpdatedByGUID = table.Column<string>(type: "nvarchar(36)", maxLength: 36, nullable: true),
                    dtUpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CategorystrCategoryGUID = table.Column<string>(type: "nvarchar(36)", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_mstBlog_CategorystrCategoryGUID",
                table: "mstBlog",
                column: "CategorystrCategoryGUID");

            migrationBuilder.CreateIndex(
                name: "IX_Registers_Email",
                table: "Registers",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Login");

            migrationBuilder.DropTable(
                name: "Menus");

            migrationBuilder.DropTable(
                name: "mstBlog");

            migrationBuilder.DropTable(
                name: "mstBlogTag");

            migrationBuilder.DropTable(
                name: "Registers");

            migrationBuilder.DropTable(
                name: "UserRights");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "mstBlogCategory");
        }
    }
}
