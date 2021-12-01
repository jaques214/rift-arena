using System.ComponentModel.DataAnnotations;

namespace RiftArena.Models
{
        public class User
        {
            [Key]
            public int UserID { get; set; }

            public string Nickname { get; set; }

            public string Password { get; set; }
            public byte[]  PasswordHash { get; set; }
            public byte[] PasswordSalt { get; set; }

            public string Rank { get; set; }

            public string Tier { get; set; }

            public string Name { get; set; }

            public string Email { get; set; }

            public string ContaRiot { get; set; }

            public int NumVitoriasTotal { get; set; }



        }
    
}

