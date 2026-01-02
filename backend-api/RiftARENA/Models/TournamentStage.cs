using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models;

public class TournamentStage
{
    [Key]
    public int StageNo { get; set; }
    //public List<Team> TeamsPerStage { get; get; }
}