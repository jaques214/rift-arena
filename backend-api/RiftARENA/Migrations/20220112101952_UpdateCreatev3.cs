using Microsoft.EntityFrameworkCore.Migrations;

namespace RiftARENA.Migrations
{
    public partial class UpdateCreatev3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxTeams",
                table: "Tournaments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxTeams",
                table: "Tournaments");
        }
    }
}
