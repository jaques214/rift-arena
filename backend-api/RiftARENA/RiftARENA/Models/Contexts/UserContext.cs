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

        //<summary>Login by username and password store procedure method.</summary>
        //<param name="usernameVal">Username value parameter</param>  
        //<param name="passwordVal">Password value parameter</param>
        public async Task<User> LoginByUsernamePasswordMethod(string usernameVal, string passwordVal)
        {
            User user = null;
            try
            {
                SqlParameter usernameParam = new SqlParameter("@username", usernameVal ?? (object)DBNull.Value);
                SqlParameter passwordParam = new SqlParameter("@password", passwordVal ?? (object)DBNull.Value);

                string sqlQuery = "select * from User where @username = User.Nickname and @password = User.Password";

                //user = await this.Query<User>.FromSql(sqlQuery, usernameParam, passwordParam).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return user;
        }
    }
}