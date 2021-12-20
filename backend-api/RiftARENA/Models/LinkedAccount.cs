using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class LinkedAccount
    {
        [Key]
        public string ID { get; set; }
        public string Username { get; set; }       
        public int profileIconID { get; set; }
        public long summonerLevel   { get; set; }
        public string Rank { get; set; }
        public string Region { get; set; }
        public virtual User User { get; set; }
        public bool validated   { get; set; }
    }
}
