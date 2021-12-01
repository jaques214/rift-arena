using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiftArena.Models.Contexts;
using RiftArena.Models;
using RiftArena.Models.Services;

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
        [HttpPost("createTeam")]
        public IActionResult CreateTeam([FromBody]Team team)
        {
            try
            {
                _service.CreateTeam(team);
                _context.SaveChanges();
                return CreatedAtRoute("GetTeam", new {id = team.TeamId}, team);
            }catch (AppException ex)
            {
                return BadRequest(new {message = ex.Message });
            }
        }


        //GET: api/Teams/{id: int}
        [HttpGet("{id}",Name = "GetTeam")]
        public ActionResult<Team> GetByID(long id)
        { 
        
            var teamCon = _service.GetByID(id);
            if (teamCon == null)
                return NotFound();
            else
                return teamCon;
          
        }



        //GET: api/Teams 
        [HttpGet(Name = "GetAllUsers")]
        public ActionResult<Team> GetAll()
        {
            var teamsCon = _service.GetAll();
            if (teamsCon == null)
               return NoContent();
            else
                return Ok(teamsCon);
        }

        //[HttpDelete("{id:int}"), Authorize]
        [HttpDelete("{id:int}")]
        public ActionResult<Team> DeleteTeam(long id)
        {
            _service.DeleteTeam(id);

            return Ok();
        }


        //[HttpPut("{id:int}"), Authorize]
        [HttpPut("{id:int}")]
        public IActionResult UpdateTeam(int id,[FromBody] Team team)
        {
            var teamUP = _context.Teams.Find(id);
            if (teamUP == null)
                return NotFound();

            teamUP.Name = team.Name;
            teamUP.Tag = team.Tag;

            _context.Teams.Update(teamUP);
            _context.SaveChanges();

            return NoContent();
            
        }

    }
}
