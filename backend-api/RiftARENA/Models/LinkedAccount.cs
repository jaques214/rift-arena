using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class LinkedAccount
    {
        [Key]
        public int ID { get; set; }
        public string Username { get; set; }
        public string Rank { get; set; }
        public string Region { get; set; }
        public virtual User User { get; set; }
    }
}
