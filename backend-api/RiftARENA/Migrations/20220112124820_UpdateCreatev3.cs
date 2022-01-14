using Microsoft.EntityFrameworkCore.Migrations;

namespace RiftARENA.Migrations
{
    public partial class UpdateCreatev3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TeamTournament",
                table: "TeamTournament");

            migrationBuilder.AddColumn<string>(
                name: "Stage",
                table: "Tournaments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "StagesTeamId",
                table: "TeamTournament",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeamTournament",
                table: "TeamTournament",
                columns: new[] { "StagesTeamId", "TournamentId" });

            migrationBuilder.CreateTable(
                name: "TeamTournaments",
                columns: table => new
                {
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    TournamentId = table.Column<int>(type: "int", nullable: false),
                    Position = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamTournaments", x => new { x.TeamId, x.TournamentId });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeamTournaments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TeamTournament",
                table: "TeamTournament");

            migrationBuilder.DropColumn(
                name: "Stage",
                table: "Tournaments");

            migrationBuilder.AlterColumn<int>(
                name: "StagesTeamId",
                table: "TeamTournament",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "TeamTournament",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeamTournament",
                table: "TeamTournament",
                columns: new[] { "TeamId", "TournamentId" });
        }
    }
}
