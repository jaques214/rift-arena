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
    public class TournamentsController : ControllerBase
    {
        private readonly RiftArenaContext _context;
        private readonly ITournamentService _service;

        public TournamentsController(RiftArenaContext context, ITournamentService service) {
            _context = context;
            _service = service;
        }

        //POST: api/Tournaments/createTournament
        [HttpPost("createTournament"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult createTournament([FromBody]Tournament tournament){
            _service.CreateTournament(tournament);
            _context.SaveChanges();
            return CreatedAtRoute("GetTournament", new { id = tournament.TournamentId }, tournament);
        }

        //GET: api/Teams/{id:int}
        [HttpGet("{id:int}", Name = "GetTournament")]
        public ActionResult<Tournament> GetByID(int id){
            var tournament = _service.GetById(id);
            if (tournament == null) {
                return NotFound();
            } else {
                return tournament;
            }
        }

        //GET: api/Tournaments
        [HttpGet]
        public ActionResult<Tournament> GetAll() {
            var tournaments = _service.GetAll();
            if(tournaments == null){
                return NoContent();
            } else {
                return Ok(tournaments);
            }
        }

        //DELETE: api/Tournaments/{id}
        [HttpDelete("{id:int}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<Tournament> DeleteTournament(int id){
            _service.DeleteTournament(id);
            _context.SaveChanges();
            return Ok();
        }

        //PUT: api/Tournaments/{id}
        [HttpPut("{id:int}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult UpdateTournament(int id, [FromBody] Tournament tournament){
            _service.UpdateTournament(id, tournament);
            _context.SaveChanges();
            return Ok();
        }
    }
}