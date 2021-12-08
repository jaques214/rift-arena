using Microsoft.EntityFrameworkCore;
using RiftArena.Models;

namespace RiftArena.Models.Contexts
{
    public class RiftArenaContext : DbContext {
        public RiftArenaContext(DbContextOptions<RiftArenaContext> options) : base(options){

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Team> Teams { get; set;}
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<Request> Requests { get; set; }
    }
}