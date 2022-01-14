using RiftArena.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{

    public enum Status
    {
        Published, NotPublished, Canceled, Soon, Online, Closed
    }
    public class Tournament
    {
        [Key]
        public int TournamentId { get; set; }

        public int NumberOfTeams { get; set; }

        public string Name { get; set;}

        public string Description { get; set;}

        [RegularExpression(@"^([A-Z]+)$", ErrorMessage = "Rank can only be capital letters")]
        public string Rank { get; set; }

        public string Region { get; set; }

        public string FinalWinner { get; set; }

        public float Prize { get; set; }

        public string Poster { get; set; }

        public virtual List<Team> Stages { get; set; }
        public string Stage {get; set;}

        public Status State { get; set; }

        public virtual List<Messages> Chat { get; set; }

        public virtual DateTime Date { get; set; }

        public string CreatorNickname {get; set; }

        public int MaxTeams {get; set;}
    }
}