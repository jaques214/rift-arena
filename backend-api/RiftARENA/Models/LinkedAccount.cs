using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class LinkedAccount
    {
        [Key]
        public string ID { get; set; }
        public string Username { get; set; }       
        public int ProfileIconID { get; set; }
        public long SummonerLevel  { get; set; }
        public string Rank { get; set; }
        public string Region { get; set; }
        public bool Validated { get; set; }
    }
}
