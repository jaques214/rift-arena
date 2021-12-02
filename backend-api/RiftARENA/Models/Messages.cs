using RiftArena.Models;
using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class Messages
    {
        [Key]
        public int MessageId { get; set; }
        public string Message { get; set; } 
        public Tournament Tournament { get; set; }
        public int userId { get; set; }
    }
}
