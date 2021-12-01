using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class Team
    {

        [Key]
        public int TeamId { get; set; }
        public string Name { get; set; }
        public string Tag { get; set; }

        public User TeamLeader { get; set; }

        public string Rank { get; set; }

        public int NumberMembers { get; set; }

        public int Wins { get; set; }

        public int Defeats { get; set; }

        public int GamesPlayed { get; set; }

        public int TournamentsWon { get; set; }

        // [ForeignKey("Id")]
        public List<User> Members { get; set; }

        //public List<int> TournamentsWon  { get; set; }

        public string Poster { get; set; }

        public LinkedList<Tournament> Tournament {get; set; }

        public readonly int MAIN_MEMBERS = 5;
        
        public readonly int SUBSTITUTE_MEMBERS = 2;

        public readonly int MAX_MEMBERS = 7;

       
        

    }
}
