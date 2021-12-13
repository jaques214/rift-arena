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


        //POST: api/Teams/createTeam
        [HttpPost("createTeam")/*,Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        public IActionResult CreateTeam([FromBody]Team team)
        {
            try
            {

                    _service.CreateTeam(team);
                    _context.SaveChanges();
                    return CreatedAtRoute("GetTeam", new { id = team.TeamId }, team);

            }catch (AppException ex)
            {
                return BadRequest(new {message = ex.Message });
            }
        }


        //GET: api/Teams/{id: int}
        [HttpGet("{id}",Name = "GetTeam")]
        public ActionResult<Team> GetByID(int id)
        { 
        
            var teamCon = _service.GetByID(id);
            if (teamCon == null)
                return NotFound();
            else
                return Ok( new {Id = teamCon.TeamId, Name = teamCon.Name, TAG = teamCon.Tag, TeamLeader = teamCon.TeamLeader.Nickname, 
                Rank = teamCon.Rank, NumberOfMembers = teamCon.NumberMembers, Wins = teamCon.Wins, Defeats = teamCon.Defeats, GamesPlayed = teamCon.GamesPlayed,
                TournamentsWon = teamCon.TournamentsWon, Members = teamCon});
          
        }


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

        //DELETE: api/Teams/{id}
        [HttpDelete("{id:int}")/*,Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        //[HttpDelete("{id:int}")]
        public ActionResult<Team> DeleteTeam(int id)
        {
            _service.DeleteTeam(id);

            return Ok();
        }


        //PUT: api/Teams/{id}
        [HttpPut("{id:int}")/*,Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        public IActionResult UpdateTeam(int id,[FromBody] Team team)
        {
            Console.WriteLine(id);
            _service.UpdateTeam(id, team);

            _context.Teams.Update(team);
            _context.SaveChanges();

            return Ok();
            
        }

        //POST: api/Teams/addMember/{id}
        [HttpPost("addMember/{id:int}")/*, Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)*/]
        public ActionResult AddMember(int id, User user)
        {
            _service.AddMember(id, user);

            _context.SaveChanges();

            return Ok();
        }

        //POST: api/Teams/removeMember/{id}
        [HttpDelete("removeMember/{id:int}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult RemoveMember(int id, User user)
        {
            _service.RemoveMember(id, user);

            _context.SaveChanges();

            return Ok() ;    
        }

    }
}
