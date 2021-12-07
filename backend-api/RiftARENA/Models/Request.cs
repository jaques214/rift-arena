using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class Request
    {
        [Key]
        public int requestId { get; set; }

        public User user { get; set; }

        public Team team { get; set; }

        public bool accepted    { get; set; }

    }
}
