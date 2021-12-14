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


        protected override void OnModelCreating(ModelBuilder builder)
        {
            /*builder.Entity<User>().HasKey(user => new
            {
                user.UserID,
                user.Nickname
            });*/
            builder.Entity<User>().HasOne(u => u.Team).WithMany(u => u.Members);
        }

    }
}