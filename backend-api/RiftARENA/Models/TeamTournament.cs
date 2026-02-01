using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RiftArena.Models
{
    public class TeamTournament
    { 
        [Key]
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int TournamentId { get; set; }
        public int Position { get; set; }

        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }

        [ForeignKey("TournamentId")]
        public virtual Tournament Tournament { get; set; }

        public override string ToString()
        {
            return base.ToString() + ": " + TeamId.ToString() + ": " + TournamentId.ToString() + ": " + Position.ToString();
        }
    }
}