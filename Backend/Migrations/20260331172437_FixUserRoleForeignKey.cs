using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixUserRoleForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_strRoleGUID",
                table: "Users",
                column: "strRoleGUID");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_UserRoles_strRoleGUID",
                table: "Users",
                column: "strRoleGUID",
                principalTable: "UserRoles",
                principalColumn: "strUserRoleGUID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_UserRoles_strRoleGUID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_strRoleGUID",
                table: "Users");
        }
    }
}
