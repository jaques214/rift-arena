using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RiftARENA.Migrations
{
    /// <inheritdoc />
    public partial class ExplicitTeamTournamentMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TournamentStage",
                columns: table => new
                {
                    StageNo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TournamentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentStage", x => x.StageNo);
                    table.ForeignKey(
                        name: "FK_TournamentStage_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TournamentId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamTournaments_TeamId",
                table: "TeamTournaments",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamTournaments_TournamentId",
                table: "TeamTournaments",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentStage_TournamentId",
                table: "TournamentStage",
                column: "TournamentId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTournaments_Teams_TeamId",
                table: "TeamTournaments",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "TeamId",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTournaments_Tournaments_TournamentId",
                table: "TeamTournaments",
                column: "TournamentId",
                principalTable: "Tournaments",
                principalColumn: "TournamentId",
                onDelete: ReferentialAction.NoAction);
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

            migrationBuilder.DropTable(
                name: "TournamentStage");

            migrationBuilder.DropIndex(
                name: "IX_TeamTournaments_TeamId",
                table: "TeamTournaments");

            migrationBuilder.DropIndex(
                name: "IX_TeamTournaments_TournamentId",
                table: "TeamTournaments");
        }
    }
}
