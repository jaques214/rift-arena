using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class Request
    {
        [Key]
        public int RequestId { get; set; }

        public User User { get; set; }

        public Team Team { get; set; }

        public bool Accepted { get; set; }

    }
}
