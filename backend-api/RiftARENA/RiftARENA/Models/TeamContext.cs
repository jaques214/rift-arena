﻿using Microsoft.EntityFrameworkCore;

namespace RiftArena.Models.Contexts
{
    public class TeamContext : DbContext
    {
<<<<<<< HEAD
        
        public TeamContext(DbContextOptions<TeamContext> options)
      : base(options)
=======
        public TeamContext(DbContextOptions<TeamContext> options): base(options)
>>>>>>> c164eb572089626cc98f9ac5325d229de800e940
        {
        }

        public DbSet<Team> Teams { get; set; } = null!;

 
    }
}
