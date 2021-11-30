using Microsoft.EntityFrameworkCore;

namespace RiftArena.Models.Contexts
{
    public class RiftArenaContext : DbContext {
        public RiftArenaContext(DbContextOptions<RiftArenaContext> options) : base(options){

        }

        public DbSet<User> RiftArenaUsers { get; set; }
        public DbSet<Team> RiftArenaTeams { get; set; }
    }
}