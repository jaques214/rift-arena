using Microsoft.EntityFrameworkCore.Migrations;

namespace RiftARENA.Migrations
{
    public partial class UpdateSecondCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rank",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MiniumTier",
                table: "Tournaments");

            migrationBuilder.RenameColumn(
                name: "Tier",
                table: "Users",
                newName: "Poster");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Poster",
                table: "Users",
                newName: "Tier");

            migrationBuilder.AddColumn<string>(
                name: "Rank",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MiniumTier",
                table: "Tournaments",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
