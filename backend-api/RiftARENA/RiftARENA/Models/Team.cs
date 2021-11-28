using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class Team
    {

        [Key]
        public int Id { get; set; }
        public string TeamName { get; set; }
        public string TeamTag { get; set; }

        public User TeamLeader { get; set; }

        public string TeamRank { get; set; }

        public int NumberMembers { get; set; }

        public int NumberOfWins { get; set; }

        public int NumberOfDefeats { get; set; }

        public int GamesPlayed { get; set; }

        // [ForeignKey("Id")]
        public List<User> Members { get; set; }

        //public List<int> TournamentsWon  { get; set; }

        public string Poster { get; set; }

    }
}
