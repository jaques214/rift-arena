using RiftArena.Models;

namespace RiftARENA.Models
{
    public class LinkedAccount
    {
        public int Id { get; set; }

        public string username { get; set; }

        public string rank { get; set; }

        public string region { get; set; }

        public User user { get; set; }
    }
}
