using System.ComponentModel.DataAnnotations;

namespace RiftARENA.Models
{
        public class User
        {
            [Key]
            public int Id { get; set; }

            public string Nickname { get; set; }

            public string password { get; set; }

            public string rank { get; set; }

            public string tier { get; set; }

            public string Name { get; set; }

            public string Email { get; set; }

            public string contaRiot { get; set; }

            public int numVitoriasTotal { get; set; }



        }
    
}

