using Microsoft.EntityFrameworkCore;
using RiftArena.Models;

namespace RiftArena.Models.Contexts
{
    public class RiftArenaContext : DbContext
    {
        public RiftArenaContext(DbContextOptions<RiftArenaContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<LinkedAccount> LinkedAccounts { get; set; }
        public DbSet<Messages> Messages { get; set; }
        public DbSet<TeamTournament> TeamTournaments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Explicitly configure TeamTournament foreign keys to avoid SQL Server
            // "multiple cascade paths" error by disabling cascade delete for these relationships.
            modelBuilder.Entity<TeamTournament>()
                .HasOne(tt => tt.Team)
                .WithMany(t => t.TeamTournaments)
                .HasForeignKey(tt => tt.TeamId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TeamTournament>()
                .HasOne(tt => tt.Tournament)
                .WithMany(t => t.TeamTournaments)
                .HasForeignKey(tt => tt.TournamentId)
                .OnDelete(DeleteBehavior.NoAction);

            base.OnModelCreating(modelBuilder);
        }
    }
}