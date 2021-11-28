using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiftArena.Models.Contexts;
using RiftArena.Models;

using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using RiftArena.Models.Contexts;
using RiftARENA.Services;

namespace RiftArena.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly RiftArenaContext _context;
        private userServices _userService;

        public UsersController(RiftArenaContext context,userServices userService)
        {
            _context = context;
            _userService = userService;
        }

        //POST: /register
        [HttpPost("register")]
        public IActionResult Register([FromBody]User user){
            try {
                //Create(user.email, user.password);
                _userService.Create(user, user.Password);
                _context.SaveChanges();
                return CreatedAtRoute("GetUser", new { id = user.UserID }, user);
            } catch(ApplicationException ex){
                return BadRequest(new {message = ex.Message });
            }
        }

        [HttpGet("{id}",Name = "GetUser")]
        public ActionResult<User> GetById(long id)
        {

            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                return user;
            }
        }

        public ActionResult GetAll(long id)
        {
            var users = _userService.GetAll();
            if (users == null)
            {
                return NoContent();
            }

           
         return Ok(users);
        }

        [HttpDelete("{id}")]
        public ActionResult<User> Delete(long id)
        {
            _userService.Delete(id);

            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]User user)
        {
            user.UserID = id;

            try
            {
                // save 
                _userService.Update(user, user.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        //POST
        /*[HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]User user){
            if(user == null) {
                return BadRequest(new { message = "Username or password is incorrect."});
            }
            var tokenHandler = new JWTSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSetting.Secret);
            var tokenDescription = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.UserID.ToString())
                });
                var Expires = DateTime.UtcNow.AddDays(7);
                var SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            }
            var token = tokenHandler.createToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            /*return Ok(new {
                Id = user.UserId,
                Nickname = user.Nickname,
                Name = user.name,
                Token = tokenString
            });*/
            
        

        //POST: /login
        [HttpPost("Login")]
        public async Task<User> LoginByUsernamePasswordMethod(string usernameVal, string passwordVal)
        {
            User user = null;
            try
            {
                var sqlQuery = from User in _context.User 
                               select * ;

                if (!String.IsNullOrEmpty(usernameVal) || !String.IsNullOrEmpty(passwordVal))
                {
                    user = sqlQuery.Where(user => {
                        user.Nickname = usernameVal;
                        user.Password = passwordVal;
                    });
                }

                //user = await this.Query<User>.FromSql(sqlQuery, usernameParam, passwordParam).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return user;
        }


        // GET: api/Users
        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetRiftArenaItems()
        {
            return await _context.RiftArenaItems.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.RiftArenaItems.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.userID)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.RiftArenaItems.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.userID }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.RiftArenaItems.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.RiftArenaItems.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        } */

        private bool UserExists(int id)
        {
            return _context.RiftArenaItems.Any(e => e.UserID == id);
        }
    }
}
