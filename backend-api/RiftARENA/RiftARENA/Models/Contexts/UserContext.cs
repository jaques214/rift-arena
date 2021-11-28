using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using RiftArena.Models.Contexts;
using RiftArena.Models;
using Microsoft.Data.SqlClient;

namespace RiftArenaAPI.Models.Contexts
{
    public class UserContext : DbContext
    {


        public UserContext(DbContextOptions<RiftArenaContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }

        
    }
}