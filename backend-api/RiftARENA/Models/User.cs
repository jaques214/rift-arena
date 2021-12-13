using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RiftArena.Models
{
        public class User
        {
            [Key]
            public int UserID { get; set; }
            [Key]
            public string Nickname { get; set; }     
            public string Password { get; set; }
            public byte[]  PasswordHash { get; set; }
            public byte[] PasswordSalt { get; set; }
            public string Rank { get; set; }
            public string Tier { get; set; }
            public string Email { get; set; }
            public string ContaRiot { get; set; }
            public int NumVitoriasTotal { get; set; }
            [ForeignKey("LinkedAccountID")]
            public virtual LinkedAccount LinkedAccount  { get; set; }
            public virtual List<Request> Requests   { get; set; }
        //public Team Team { get; set; }

        public override string ToString()
        {
            return base.ToString() + ": " + Nickname.ToString() + ": " + UserID.ToString() + ": " + Email.ToString() + ": " + Password.ToString();
        }

    }
    
}

