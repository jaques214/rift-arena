using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiftArena.Models.Contexts;
using RiftArena.Models;
using RiftArena.Models.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;


namespace RiftArena.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly RiftArenaContext _context;
        private readonly ITeamService _service;

        public TeamsController(RiftArenaContext context, ITeamService service)
        {
            _context = context;
            _service = service;
        }

        /// <summary>
        /// Método que permite a criação de uma equipa, chamando o método CreateTeam implementado no teamService
        /// </summary>
        /// <param name="team">Equipa a ser criada</param>
        /// <returns>Equipa criada</returns>
        //POST: api/Teams/createTeam
        [HttpPost("createTeam")/*,Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        public IActionResult CreateTeam([FromBody] Team team)
        {
            try
            {

                _service.CreateTeam(team);
                _context.SaveChanges();
                return CreatedAtRoute("GetTeam", new { id = team.TeamId }, team);

            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Método que retorna uma equipa através de um ID, chamando o método GetByID implementado no teamService
        /// </summary>
        /// <param name="id">ID da equipa a retornar</param>
        /// <returns>Equipa com ID fornecido</returns>
        //GET: api/Teams/{id: int}
        [HttpGet("{id}", Name = "GetTeam")]
        public ActionResult<Team> GetByID(int id)
        {

            var teamCon = _service.GetByID(id);
            if (teamCon == null)
                return NotFound();
            else
                return Ok(new
                {
                    Id = teamCon.TeamId,
                    Name = teamCon.Name,
                    TAG = teamCon.Tag,
                    TeamLeader = teamCon.TeamLeader,
                    Rank = teamCon.Rank,
                    NumberOfMembers = teamCon.NumberMembers,
                    Wins = teamCon.Wins,
                    Defeats = teamCon.Defeats,
                    GamesPlayed = teamCon.GamesPlayed,
                    TournamentsWon = teamCon.TournamentsWon,
                    Members = teamCon
                });

        }

        /// <summary>
        /// Método que retorna todas as equipas existentes, chamando o método GetAll implementado no teamService
        /// </summary>
        /// <returns>Todas as equipas existentes</returns>
        //GET: api/Teams 
        [HttpGet]
        public ActionResult<Team> GetAll()
        {
            var teamsCon = _service.GetAll();
            if (teamsCon == null)
                return NoContent();
            else
                return Ok(teamsCon);
        }
        /// <summary>
        /// Método que permite a eliminação de uma equipa, chamando o método DeleteTeam implementado no teamService
        /// </summary>
        /// <param name="id">ID da equipa a eliminar</param>
        /// <returns>Ok</returns>
        //DELETE: api/Teams/{id}
        [HttpDelete("{id:int}")/*,Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        //[HttpDelete("{id:int}")]
        public ActionResult<Team> DeleteTeam(int id)
        {
            _service.DeleteTeam(id);

            return Ok();
        }

        /// <summary>
        /// Método que permite a edição de uma equipa, chamando o método UpdateTeam implementado no teamService
        /// </summary>
        /// <param name="id">ID da equipa a editar</param>
        /// <param name="team">Equipa com as edições feitas</param>
        /// <returns>Equipa editada</returns>
        //PUT: api/Teams/{id}
        [HttpPut("{id:int}")/*,Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        public IActionResult UpdateTeam(int id, [FromBody] Team team)
        {
            Console.WriteLine(id);
            _service.UpdateTeam(id, team);

            _context.Teams.Update(team);
            _context.SaveChanges();

            return Ok();

        }
        /// <summary>
        /// Método que permite a adição de um membro a uma equipa, chamando o método AddMember implementado no teamService
        /// </summary>
        /// <param name="id">ID da equipa que o user será adicionado</param>
        /// <param name="user">User que será adicionado</param>
        /// <returns>Ok</returns>
        //POST: api/Teams/addMember/{id}
        [HttpPost("{id:int}/addMember")/*, Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        public ActionResult AddMember(int id, [FromBody] User user)
        {
            _service.AddMember(id, user);

            _context.SaveChanges();

            return Ok();
        }
        /// <summary>
        /// Método que permite a remoção de um membro a uma equipa, chamando o método RemoveMember implementado no teamService
        /// </summary>
        /// <param name="id">ID da equipa que o user será removido</param>
        /// <param name="user">User que será removido</param>
        /// <returns>Ok</returns>
        //POST: api/Teams/removeMember/{id}
        [HttpDelete("{id:int}/removeMember")/*, Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        public ActionResult RemoveMember(int id, [FromBody] User user)
        {
            _service.RemoveMember(id, user);

            _context.SaveChanges();

            return Ok();
        }

    }
}
