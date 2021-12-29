using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RiftArena.Models
{
        //Eliminar rank e Tier do model User
        public class User
        {
            [Key]
            public int UserID { get; set; }
            [RegularExpression(@"^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$", ErrorMessage = "Invalid nickname")]
            public string Nickname { get; set; }     
            public string Password { get; set; }
            public byte[]  PasswordHash { get; set; }
            public byte[] PasswordSalt { get; set; }
            public string Rank { get; set; }
            public string Tier { get; set; }
            [RegularExpression(@"^[a-z._\d]+\@[a-z]+(\.[a-z]+)*$", ErrorMessage = "Invalid email")]
            public string Email { get; set; }
            public string ContaRiot { get; set; }
            public int NumVitoriasTotal { get; set; }
            [ForeignKey("LinkedAccountID")]
            public virtual LinkedAccount LinkedAccount  { get; set; }
            public virtual List<Request> Requests   { get; set; }
            public string TeamTag { get; set; }

        public override string ToString()
        {
            return base.ToString() + ": " + Nickname.ToString() + ": " + UserID.ToString() + ": " + Email.ToString() + ": " + Password.ToString();
        }

    }
    
}

