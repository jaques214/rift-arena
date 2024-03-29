﻿using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
    public class Request
    {
        [Key]
        public int RequestId { get; set; }

        public string UserNickname { get; set; }

        public virtual Team Team { get; set; }

        public bool Accepted { get; set; }

    }
}
