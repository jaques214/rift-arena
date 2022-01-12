using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;
using RiftArena.Models;

namespace RiftArena.Models
{
    public class Team
    {

        [Key]
        public int TeamId { get; set; }
        public string Name { get; set; }
        [RegularExpression(@"^[A-Z]{3}$", ErrorMessage = "TAG should only have 3 characters and can only be letters")]
        public string Tag { get; set; }
        public string TeamLeader { get; set; }
        public string Rank { get; set; }

        public int NumberMembers { get; set; }

        public int Wins { get; set; }

        public int Defeats { get; set; }

        public int GamesPlayed { get; set; }

        public int TournamentsWon { get; set; }

        public virtual List<User> Members { get; set; }

        public string Poster { get; set; }
        /*
        [NotMapped]
        [DisplayName("Upload File")]
        public IFormFile PosterFile { get; set; }
        */
        public List<string> Tournament {get; set; }

        public readonly int MAIN_MEMBERS = 5;
        
        public readonly int SUBSTITUTE_MEMBERS = 2;

        public readonly int MAX_MEMBERS = 7;


        public override string ToString()
        {
            return base.ToString() + ": " + TeamLeader.ToString() + TeamId.ToString();
        }

    }
}
