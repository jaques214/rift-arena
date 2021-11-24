using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class Team
    {

        [Key]
        public int Id { get; set; }
        public string teamName { get; set; }
        public string teamTag { get; set; }

        public User teamLeader { get; set; }

        public string teamRank { get; set; }

        public int numberMembers { get; set; }

        public int numberOfWins { get; set; }

        public int numberOfDefeats { get; set; }

        public int gamesPlayed { get; set; }

        // [ForeignKey("Id")]
        public List<User> members { get; set; }

        //public List<int> tournamentsWon  { get; set; }

        public string avatar { get; set; }

    }
}
