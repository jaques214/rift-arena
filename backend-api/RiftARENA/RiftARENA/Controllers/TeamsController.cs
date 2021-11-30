using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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



        [HttpPost]
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

        [HttpGet("{id}",Name = "GetTeam")]
        public ActionResult<Team> GetByID(long id)
        { 
        
            var teamCon = _service.GetByID(id);
            if (teamCon == null)
                return NotFound();
            else
                return teamCon;
          
        }

        [HttpGet(Name = "GetAllUsers")]
        public ActionResult<Team> GetAll()
        {
            var teamsCon = _service.GetAll();
            if (teamsCon == null)
               return NoContent();
            else
                return Ok(teamsCon);
        }

        [HttpDelete("{id}")]
        public ActionResult<Team> DeleteTeam(long id)
        {
            _service.DeleteTeam(id);

            return Ok();
        }

        [HttpPut("{id}")]
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
    

/*
        // GET: api/Teams
        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            return await _context.Team.ToListAsync();
        }

        // GET: api/Teams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await _context.Team.FindAsync(id);

            if (team == null)
            {
                return NotFound();
            }

            return team;
        }

        // PUT: api/Teams/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeam(int id, Team team)
        {
            if (id != team.Id)
            {
                return BadRequest();
            }

            _context.Entry(team).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(id))
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

        // POST: api/Teams
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Team>> PostTeam(Team team)
        {
            _context.Team.Add(team);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeam", new { id = team.Id }, team);
        }

        // DELETE: api/Teams/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var team = await _context.Team.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            _context.Team.Delete(team);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeamExists(int id)
        {
<<<<<<< HEAD
            return _context.Team.Any(e => e.Id == id);
=======
            return _context.Teams.Any(e => e.Id == id);
>>>>>>> 3b6fb55d2b4ac8ef3bade8e196c1bf6b6416ca79
        }*/
    }
}
