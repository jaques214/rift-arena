using Microsoft.EntityFrameworkCore;
using RiftArena.Models;

namespace RiftArena.Models.Contexts
{
    public class RiftArenaContext : DbContext {
        public RiftArenaContext(DbContextOptions<RiftArenaContext> options) : base(options){

        }

        public DbSet<User> RiftArenaItems { get; set; }
    }
}