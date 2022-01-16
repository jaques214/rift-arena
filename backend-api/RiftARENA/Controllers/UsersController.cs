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
using RiftArena.Helpers;
using Newtonsoft.Json;
using System.Web;
using System.IO;
using System.Net.Http.Headers;

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
        private readonly ITeamService _teamService;
        private readonly AppSettings _appSettings;

        public UsersController(RiftArenaContext context, IUserService userService, IOptions<AppSettings> appSettings, ITeamService teamService)
        {
            _context = context;
            _userService = userService;
            _appSettings = appSettings.Value;
            _teamService = teamService;

        }

        //GET: api/Users/requests
        /// <summary>
        /// Método que returnará uma lista de todos os pedidos do utilizador logado.
        /// </summary>
        /// <returns>OK 200 e uma lista com os pedidos do utilizador logado</returns>
        [HttpGet("requests", Name = "GetUserRequests"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult GetAllRequestsByUserId()
        {
            var list = _userService.GetAllRequestsOfUserById(User.Identity.Name);

            return Ok(list);
        }

        //POST: api/Users/vincularConta
        /// <summary>
        /// Método que vinculará uma conta RIOT ao utilizador logado
        /// </summary>
        /// <param name="acc">Username e região da conta RIOT a ser vinculada</param>
        /// <returns>OK 200</returns>
        [HttpPost("vincularConta"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult linkContaRiot([FromBody] LinkedAccount acc)
        {
            User userTemp = _userService.LinkRiot(User.Identity.Name, acc.Username, acc.Region);
            _context.SaveChanges();

            return Ok(userTemp);
        }

        //POST: api/Users/validarConta
        /// <summary>
        /// Método que valida a conta linkada pelo utiliazador logado
        /// </summary>
        /// <returns>OK 200</returns>
        [HttpPost("validarConta"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult ValidateRiotAccount()
        {
            User userTemp = _userService.GetByUsername(User.Identity.Name);
            _userService.ValidateRiot(userTemp.LinkedAccount);
            _context.SaveChanges();

            return Ok(new
            {
                userTemp.Nickname,
                userTemp.LinkedAccount.Rank,
                userTemp.LinkedAccount.ProfileIconID
            });
        }

        //Vai atualizar as informa��es da conta Riot do utilizador
        [HttpPost("updateRiot"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult UpdateStatsRiotAccount()
        {
            _userService.UpdateRiotAccount(User.Identity.Name);
            _context.SaveChanges();
            return Ok();
        }


        //POST: api/Users/desvincular
        /// <summary>
        /// Método que desvinculará a conta RIOT do utilizador logado.
        /// </summary>
        /// <returns>OK 200</returns>
        [HttpPost("desvincularConta"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult DesvincularContaRiot()
        {
            var user = _userService.UnlinkRiot(User.Identity.Name);
            _context.Update(user);
            _context.SaveChanges();
            return Ok();
        }

        //POST: api/Users/register
        /// <summary>
        /// Método para registar um utilizador.
        /// </summary>
        /// <param name="user">Utilizador a ser registado.</param>
        /// <returns>Ok 200 e utilizador registado ou Bad Request 400 e mensagem de erro</returns>
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {

            try
            {
                _userService.Create(user, user.Password);
                _context.SaveChanges();

                return this.LoginAuthenticate(user);
                //return CreatedAtRoute("GetUser", new { username = user.Nickname }, user);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        //POST: api/Users/createRequest
        [HttpPost("createRequest"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult CreateRequestByUser([FromBody] User userSent)
        {
            User user = _userService.GetByUsername(User.Identity.Name);

            var team = _teamService.GetByTag(user.TeamTag);
            if (user.TeamTag == null)
            {
                try
                {
                    _userService.CreateRequest(userSent.Nickname, team);
                    _context.SaveChanges();
                    return Ok();
                }
                catch (ApplicationException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
            {

                if (team.TeamLeader.Equals(user.Nickname))
                {
                    try
                    {
                        _userService.CreateRequest(userSent.Nickname, team);
                        _context.SaveChanges();
                        return Ok();
                    }
                    catch (ApplicationException ex)
                    {
                        return BadRequest(new { message = ex.Message });
                    }
                }
                else
                {
                    return BadRequest();
                }

            }

        }



        //GET: api/Users/{username: string}
        /// <summary>
        /// Método que retorna os dados do utilizador pesquisado pelo seu nickname.
        /// </summary>
        /// <param name="username">Nickname do utilizador a ser pesquisado.</param>
        /// <returns>Os dados do utilizador pesquisado.</returns>
        [HttpGet("{username}", Name = "GetUser")]
        public ActionResult<User> GetByUsername([FromBody] User username)
        {
            var user = _userService.GetByUsername(username.Nickname);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        /// <summary>
        /// Método que retorna os dados do utilizador logado.
        /// </summary>
        /// <returns>Os dados do utilizador logado.</returns>
        [HttpGet("withToken"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<User> GetByToken()

        {
            var user = _userService.GetByUsername(User.Identity.Name);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        //GET: api/Users 
        /// <summary>
        /// Método que retorna uma lista com todos os utilizadores registados.
        /// </summary>
        /// <returns>OK 200 e lista com todos os utilizadores registados.</returns>
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

        //DELETE: api/Users
        /// <summary>
        /// Método que elimina a conta do utilizador logado.
        /// </summary>
        /// <returns>OK 200 ou Not Found 404 se o utilizador logado já não existir</returns>
        [HttpDelete, Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<User> Delete()
        {
            var user = _userService.GetByUsername(User.Identity.Name);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                _userService.Delete(User.Identity.Name);
                return Ok();
            }

        }

        //PUT: api/Users
        /// <summary>
        /// Método que permite atualizar os dados do utilizador logado.
        /// </summary>
        /// <param name="user">Dados do utilizador a serem atualizados</param>
        /// <returns>OK 200</returns>
        [HttpPut, Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult Update([FromBody] User user)
        {
            var userUp = _userService.GetByUsername(User.Identity.Name);
            if (userUp == null)
            {
                return NotFound();
            }
            else
            {
                try
                {
                    if (user.Password == null)
                    {
                        userUp.Email = user.Email;
                    }
                    if (user.Email == null)
                    {
                        userUp.Password = user.Password;
                    }
                    else if (user.Email != null && user.Password != null)
                    {
                        userUp.Password = user.Password;
                        userUp.Email = user.Email;
                        _userService.Update(userUp);
                        _context.SaveChanges();
                    }
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
        /// <summary>
        /// Método que permite logar um utilizador.
        /// </summary>
        /// <param name="userLogin">Username e password do utilizador.</param>
        /// <returns>OK 200 e ID, nickname e token do utilizador.</returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult LoginAuthenticate([FromBody] User userLogin)
        {

            var user = _userService.Authenticate(userLogin.Nickname, userLogin.Password);
            if (user == null)
            {
                return BadRequest(new { message = "Username or password is incorrect." });
            }

            var key = Encoding.ASCII.GetBytes(_appSettings.Token);
            var tokenString = _userService.GenerateToken(key, user);

            return Ok(new
            {
                Token = tokenString
            });
        }

        //POST: api/Users/acceptRequest
        /// <summary>
        /// Método que irá aceitar um pedido que o utilizador logado tem de modo a entrar numa equipa.
        /// </summary>
        /// <param name="request">(verificar)</param>
        /// <returns>OK 200 ou Bad Request 400 caso (especificar)</returns>
        [HttpPost("acceptRequest"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult AcceptRequests([FromBody] Request request)
        {
            var user = _userService.GetByUsername(User.Identity.Name);
            var req = _context.Requests.Find(request.RequestId);

            if (user.TeamTag != null)
            {
                return BadRequest();
            }
            else
            {
                if (user.Requests.Contains(req))
                {
                    if (req.Team.Members.Count == req.Team.MAX_MEMBERS)
                    {
                        return BadRequest();
                    }
                    else
                    {
                        req.Accepted = true;
                        user.Requests.Remove(req);
                        user.TeamTag = req.Team.Tag;
                        _context.Update(req);
                        _context.Update(user);

                        Team temp = _context.Teams.Find(req.Team.TeamId);

                        _teamService.AddMember(user.Nickname, temp.TeamId);
                        _context.SaveChanges();

                        return Ok();
                    }
                }
                else
                {
                    return BadRequest();
                }
            }
        }

        //POST: api/Users/refuseRequest
        /// <summary>
        /// Método que permite ao utilizador logado recusar um dos seus pedidos.
        /// </summary>
        /// <param name="request">(verificar)</param>
        /// <returns>OK 200</returns>
        [HttpPost("refuseRequest"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult RefuseRequest([FromBody] Request request)
        {
            var user = _userService.GetByUsername(User.Identity.Name);
            var req = _context.Requests.Find(request.RequestId);


            if (user.Requests.Contains(req))
            {
                req.Accepted = false;
                user.Requests.Remove(req);
                _context.Update(req);
                _context.Update(user);
                _context.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        
        
    }
}

