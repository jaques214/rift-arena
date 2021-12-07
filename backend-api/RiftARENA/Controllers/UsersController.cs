using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiftArena.Models.Contexts;
using RiftArena.Models;
using RiftArena.Models.Services;
using Microsoft.Extensions.Options;

using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using RiftARENA.Models;

namespace RiftArena.Controllers
{
    //Classe referente ao controller dos utilizadores
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        //Context da BD
        private readonly RiftArenaContext _context;
        private readonly IUserService _userService;

        public UsersController(RiftArenaContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        //POST: api/Users/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {

            try
            {
                _userService.Create(user, user.Password);
                _context.SaveChanges();
                return CreatedAtRoute("GetUser", new { id = user.UserID }, user);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        public IActionResult AcceptRequests(User user,Request request)
        {
            if (user.team != null)
            {
              return BadRequest();
            }
            else
            {
                if (user.requests.Contains(request))
                {
                    request.accepted = true;
                    user.requests.Remove(request);
                    user.team = request.team;
                    return Ok(user);
                }
                else
                {
                    return BadRequest();
                }
              
            }        
 
        }

        //GET: api/Users/{id: int}
        [HttpGet("{id:int}", Name = "GetUser")]
        public ActionResult<User> GetById(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        //GET: api/Users 
        [HttpGet]
        public ActionResult GetAll()
        {
            var users = _userService.GetAll();
            if (users == null)
            {
                return NoContent();
            }
            return Ok(users);
        }

        //[HttpDelete("{id:int}"), Authorize]
        [HttpDelete("{id:int}")]
        public ActionResult<User> Delete(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                _userService.Delete(id);
                return Ok();
            }

        }

        
        //[HttpPut("{id:int}"), Authorize]
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] User user)
        {

            var userUp = _context.Users.Find(id);

            if (userUp == null)
            {
                return NotFound();
            }
            else
            {
                try
                {
                    // save 
                    userUp.Password = user.Password;
                    userUp.Email = user.Email;

                    _userService.Update(userUp);
                    _context.SaveChanges();
                    return Ok();
                }
                catch (AppException ex)
                {
                    // return error message if there was an exception
                    return BadRequest(new { message = ex.Message });
                }

            }

        }

        //POST: api/Users/login
        [HttpPost("login")]
        public IActionResult LoginAuthenticate([FromBody]User userLogin){

            var user = _userService.Authenticate(userLogin.Nickname, userLogin.Password);
            if(user == null) {
                return BadRequest(new { message = "Username or password is incorrect."});
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("AppSettings:Token");
            var tokenDescription = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim(ClaimTypes.Name, user.UserID.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescription);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new {
                Id = user.UserID,
                Nickname = user.Nickname,
               // Name = user.Name,
                Token = tokenString
            });
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserID == id);
        }

    }
}