using Microsoft.EntityFrameworkCore;

namespace RiftArena.Models.Contexts
{
    public class TeamContext : DbContext
    {
        public TeamContext(DbContextOptions<TeamContext> options): base(options)
        {
        }

        public DbSet<Team> Teams { get; set; } = null!;
    }
}
