using Microsoft.EntityFrameworkCore.Migrations;

namespace RiftARENA.Migrations
{
    public partial class UpdateCreatev5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeamTournaments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    TournamentId = table.Column<int>(type: "int", nullable: false),
                    Position = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamTournaments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamTournament_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_TeamTournament_Tournaments_IdTournament",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TournamentId",
                        onDelete: ReferentialAction.NoAction);
                });

            
            migrationBuilder.DropPrimaryKey(
                name: "PK_TeamTournaments",
                table: "TeamTournaments");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeamTournaments",
                table: "TeamTournaments",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeamTournaments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TeamTournaments",
                table: "TeamTournaments");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "TeamTournaments");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeamTournaments",
                table: "TeamTournaments",
                columns: new[] { "TeamId", "TournamentId" });
        }
    }
}
