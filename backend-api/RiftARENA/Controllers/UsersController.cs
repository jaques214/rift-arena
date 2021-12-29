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
using Microsoft.AspNetCore.Authentication.JwtBearer;

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

        //retorna os requests de um determinado utilizador
        [HttpGet("{id:int}/requests", Name = "GetUserRequests")]
        public ActionResult GetAllRequestsByUserId(int id)
        {
           var list = _userService.GetAllRequestsOfUserById(id);

            return Ok(list);
        }

        //Vai vincular uma conta riot a um user
        [HttpPost("{id:int}/vincular")]
        public ActionResult linkContaRiot(int id)
        {
            //User userTemp = _userService.LinkRiot(userID,acc.Username,acc.Region);
            User userTemp = _userService.LinkRiot(id,"MiMo313","euw1");
            _context.SaveChanges();

            return Ok(userTemp);
        }

        //Vai validar a conta linkada pelo user
        [HttpPost("{id:int}/validar")]
        public ActionResult ValidateRiotAccount(int id)
        {
            // validar token e extrair nickname do token
            // atraves do nickname, obter id do user 
            User userTemp = _userService.GetById(id);
            _userService.ValidateRiot(userTemp.LinkedAccount);
            _context.SaveChanges();

            return Ok(userTemp);
        }

        //Vai atualizar as informações da conta Riot do utilizador
        [HttpPost("{id:int}/updateRiot")]
        public ActionResult UpdateStatsRiotAccount(int id)
        {
            _userService.UpdateRiotAccount(id);
            _context.SaveChanges();
            return Ok();
        }


        //POST: api/Users/desvincular
        [HttpPost("{id:int}/desvincular")]
        public void DesvincularContaRiot(int id)
        {
             var user = _userService.UnlinkRiot(id);
            //Confirmar onde dar Update
            _context.Update(user);
            _context.SaveChanges();
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

        //POST: api/Users/createRequest
        [HttpPost("{id:int}/createRequest")]
        public IActionResult CreateRequestByUser(int id)
        {
            try
            {
                _userService.CreateRequest(id);  
                _context.SaveChanges();
                return Ok();
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
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

        [HttpDelete("{id:int}")/*, Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        //[HttpDelete("{id:int}")]
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

        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(AuthenticationSchemes="Bearer")]
        [HttpPut("{id:int}")]
        //[HttpPut("{id:int}")]
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

            //HttpContext.Request.Headers.Add("token", tokenString);
            return Ok(new {
                Id = user.UserID,
                Nickname = user.Nickname,
                Token = tokenString
            });
        }

        //POST: api/Users/{id}/acceptRequest
        [HttpPost("{id:int}/acceptRequest"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult AcceptRequests( int id, [FromBody]Request request)
        {
            var user = _userService.GetById(id);
            if (user.Team != null)
            {
              return BadRequest();
            }
            else
            {
                if (user.Requests.Contains(request))
                {
                    if(request.Team.Members.Count == request.Team.MAX_MEMBERS)
                    {
                        return BadRequest();
                    }
                    else
                    {
                        request.Accepted = true;
                        user.Requests.Remove(request);
                        user.Team = request.Team;
                        _context.Update(request);
                        _context.Update(user);

                        Team temp = _context.Teams.Find(request.Team);

                        temp.Members.Add(user);
                        _context.Teams.Update(temp);
                        _context.SaveChanges();

                        return Ok(user);
                    }

                }
                else
                {
                    return BadRequest();
                }
              
            }        
 
        }

        //POST: api/Users/{id}/refuseRequest
        [HttpPost("{id:int}/refuseRequest"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult RefuseRequest(int userID, [FromBody]Request request)
        {
            var user = _userService.GetById(userID);
            if (user.Team != null)
            {
                return BadRequest();
            }
            else
            {
                if (user.Requests.Contains(request))
                {
                    request.Accepted = false;
                    user.Requests.Remove(request);
                    _context.Update(request);
                    _context.Update(user);
                    _context.SaveChanges();
                    return Ok(user);
                }
                else
                {
                    return BadRequest();
                }
            }

        }
        
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserID == id);
        }

    }
}
