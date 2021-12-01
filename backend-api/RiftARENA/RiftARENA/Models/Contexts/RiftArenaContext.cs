using Microsoft.EntityFrameworkCore;
<<<<<<< HEAD
using RiftArena.Models;
=======
>>>>>>> 430b4028740d54f83fc9e2089137b0e887988ebc

namespace RiftArena.Models.Contexts
{
    public class RiftArenaContext : DbContext {
        public RiftArenaContext(DbContextOptions<RiftArenaContext> options) : base(options){

        }

<<<<<<< HEAD
        public DbSet<User> Users { get; set; }
        public DbSet<Team> Teams { get; set;}
        //public DbSet<Tournament> Tournaments { get; set; }
=======
        public DbSet<User> RiftArenaUsers { get; set; }
        public DbSet<Team> RiftArenaTeams { get; set; }
>>>>>>> 430b4028740d54f83fc9e2089137b0e887988ebc
    }
}