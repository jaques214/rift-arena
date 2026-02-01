using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RiftARENA.Migrations
{
    /// <inheritdoc />
    public partial class FixTeamTournamentCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamTournaments_Teams_TeamId",
                table: "TeamTournaments");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamTournaments_Tournaments_TournamentId",
                table: "TeamTournaments");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTournaments_Teams_TeamId",
                table: "TeamTournaments",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTournaments_Tournaments_TournamentId",
                table: "TeamTournaments",
                column: "TournamentId",
                principalTable: "Tournaments",
                principalColumn: "TournamentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamTournaments_Teams_TeamId",
                table: "TeamTournaments");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamTournaments_Tournaments_TournamentId",
                table: "TeamTournaments");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTournaments_Teams_TeamId",
                table: "TeamTournaments",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "TeamId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTournaments_Tournaments_TournamentId",
                table: "TeamTournaments",
                column: "TournamentId",
                principalTable: "Tournaments",
                principalColumn: "TournamentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
