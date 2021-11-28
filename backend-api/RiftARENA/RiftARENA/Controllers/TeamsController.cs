using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiftArena.Models.Contexts;
using RiftArena.Models;

namespace RiftArenaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly RiftArenaContext _context;
        private readonly TeamContext _context;
        private teamServices _teamService;

        public TeamsController(RiftArenaContext context)
        {
            _context = context;
        }



        [HttpPost]
        public IActionResult CreateTeam([FromBody]Team team)
        {
            try
            {
                _teamService.CreateTeam(team);
                _context.SaveChanges();
                return CreatedAtRoute("GetTeam", new {id = team.Id}, team)
            }catch (AppException ex)
            {
                return BadRequest(new {message = ex.message});
            }
        }

        [HttpGet]
        public IActionResult<Team> GetByID(long id)
        { 
        
            var teamCon = _teamService.GetByID(id);
            if (teamCon == null)
                return NotFound();
            else
                return teamCon;
          
        }

        [HttpGet]
        public IActionResult<Team> GetAll()
        {
            var teamsCon = _teamService.GetAll();
            if (teamsCon == null)
               return NoContent;
            else
                return Ok(teamsCon);
        }

        [HttpDelete]
        public IActionResult<Team> DeleteTeam(long id)
        {
            _teamService.DeleteTeam(id);

            return Ok();
        }

        [HttpPut]
        public IActionResult UpdateTeam(int id,[FromBody] Team team)
        {
            var teamUP = _context.Teams.Find(id);
            if (teamUP == null)
                return NotFound();

            teamUP.TeamName = team.TeamName;
            teamUP.TeamTag = team.TeamTag;

            _context.Teams.Update(teamUp);
            _context.SaveChanges();

            return NoContent();
            
        }
    

/*
        // GET: api/Teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            return await _context.Teams.ToListAsync();
        }

        // GET: api/Teams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);

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
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeam", new { id = team.Id }, team);
        }

        // DELETE: api/Teams/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeamExists(int id)
        {
            return _context.Teams.Any(e => e.Id == id);
        }*/
    }
}
