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
        public ActionResult<Team> GetByID(string Tag)
        { 
        
            var teamCon = _service.GetByTag(Tag);
            if (teamCon == null)
                return NotFound();
            else
                return teamCon;
          
        }



        //GET: api/Teams 
        [HttpGet(Name = "GetAllTeams")]
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
        public ActionResult<Team> DeleteTeam(string Tag)
        {
            _service.DeleteTeam(Tag);

            return Ok();
        }


        //[HttpPut("{id:int}"), Authorize]
        [HttpPut("{id:int}")]
        public IActionResult UpdateTeam(string Tag,[FromBody] Team team)
        {
            _service.UpdateTeam(Tag, team);

            _context.Teams.Update(team);
            _context.SaveChanges();

            return NoContent();
            
        }

        [HttpPost("addMember/{id:int}")]
        public ActionResult AddMember(string Tag, User user)
        {
            _service.AddMember(Tag, user);

            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("removeMember/{id:int}")]
        public ActionResult RemoveMember(string Tag, User user)
        {
            _service.RemoveMember(Tag, user);

            _context.SaveChanges();

            return NoContent() ;    
        }

    }
}
