using Microsoft.AspNetCore.Mvc;
using RiftArena.Models.Contexts;
using RiftArena.Models;
using RiftArena.Models.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IO;
using System.Net.Http.Headers;
using System.Collections.Generic;

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
        /// <summary>
        /// Método que permite ao utilizador logado criar um torneio.
        /// </summary>
        /// <param name="tournament">Dados do torneio a ser criado.</param>
        /// <returns>Dados do torneio criado.</returns>
        [HttpPost("createTournament"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult createTournament([FromBody] Tournament tournament) {
            _service.CreateTournament(tournament, User.Identity.Name);
            _context.SaveChanges();
            return CreatedAtRoute("GetTournament", new { id = tournament.TournamentId }, tournament);
        }

        //POST: api/Tournaments/startTournament
        /// <summary>
        /// Método que permite ao utilizador logado iniciar um torneio.
        /// </summary>
        /// <param name="tournament">Dados do torneio a ser iniciado.</param>
        /// <returns>Dados do torneio iniciado.</returns>
        [HttpPost("startTournament"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult startTournament([FromBody] Tournament tournament)
        {
            _service.startTournament(tournament);
            _context.SaveChanges();
            return Ok();
        }

        //POST: api/Tournaments/startTournament
        /// <summary>
        /// Método que permite ao utilizador logado iniciar um torneio.
        /// </summary>
        /// <param name="tournament">Dados do torneio a ser iniciado.</param>
        /// <returns>Dados do torneio iniciado.</returns>
        [HttpPost("{id:int}/nextStage"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult nextStage([FromBody] List<string> nextTeams,int id)
        {
            _service.nextStage(nextTeams,id);
            _context.SaveChanges();
            return Ok();
        }

       
        /// <summary>
        /// Método que permite ver as teams todas de um torneio e o seu stage.
        /// </summary>
        /// <param name="id">Id do torneio.</param>
        /// <returns>Equipas e posição no torneio.</returns>
        [HttpGet("{id:int}/getTeamsInTournament", Name = "GetTeamsAndStagesInTournament")]
        public IActionResult GetTeamsAndStagesInTournament(int id)
        {
            return Ok(_service.GetTeamsAndStageByTournament(id));
        }



        //GET: api/Tournaments/{id:int}
        /// <summary>
        /// Método que retorna os dados do torneio a ser pesquisado pelo seu id.
        /// </summary>
        /// <param name="id">ID do torneio a ser pesquisado.</param>
        /// <returns>OK 200 e dados do torneio a ser pesquisado ou Bad Request 400 caso não exita o torneio a ser pesquisado.</returns>
        [HttpGet("{id:int}", Name = "GetTournament")]
        public ActionResult<Tournament> GetByID(int id) {
            var tournament = _service.GetById(id);
            if (tournament == null) {
                return NotFound();
            } else {
                return Ok(tournament);
            }
        }

        //GET: api/Tournaments
        /// <summary>
        /// Método que retorna uma lista com todos os torneios criados.
        /// </summary>
        /// <returns>OK 200 e lista dos torneios ou No content 204 caso não haja conteúdo.</returns>
        [HttpGet]
        public ActionResult<Tournament> GetAll() {
            var tournaments = _service.GetAll();
            if (tournaments == null) {
                return NoContent();
            } else {
                return Ok(tournaments);
            }
        }
        /// <summary>
        /// Método que retorna uma lista com todos os torneios criados pelo user logado.
        /// </summary>
        /// <returns>Ok 200 e lista dos torneios criados pelo user logado ou No content 204 caso não haja conteúdo.</returns>
        [HttpGet("getUserTournaments"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<Tournament> GetAllUserTournaments()
        {
            var myTournaments =  _service.GetAllUserTournaments(User.Identity.Name);
            if (myTournaments == null)
            {
                return NoContent();
            }
            else
            {
                return Ok(myTournaments);
            }

        }
        //DELETE: api/Tournaments/{id}
        /// <summary>
        /// Método que permite eliminar um torneio criado e não publicado.
        /// </summary>
        /// <param name="id">ID do torneio a ser eliminado.</param>
        /// <returns>OK 200</returns>
        [HttpDelete("{id:int}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<Tournament> DeleteTournament(int id) {
            _service.DeleteTournament(id, User.Identity.Name);
            _context.SaveChanges();
            return Ok();
        }

        //PUT: api/Tournaments/{id}
        /// <summary>
        /// Método que permite alterar os dados de um torneio.
        /// </summary>
        /// <param name="id">ID do torneio cujos dados serão alterados.</param>
        /// <param name="tournament">Dados do torneio para serem atualizados.</param>
        /// <returns>OK 200</returns>
        [HttpPut("{id:int}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult UpdateTournament(int id, [FromBody] Tournament tournament) {
            _service.UpdateTournament(id, tournament, User.Identity.Name);
            _context.SaveChanges();
            return Ok();
        }

        //PUT: api/Tournaments/{id:int}/publish
        /// <summary>
        /// Método que permite publicar um torneio criado.
        /// </summary>
        /// <param name="id">ID do torneio a ser publicado.</param>
        /// <returns>OK 200</returns>
        [HttpPut("{id:int}/publish"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<Tournament> PublishTournament(int id)
        {
            _service.PublishTournament(id, User.Identity.Name);
            _context.SaveChanges();
            return Ok();
        }

        /// <summary>
        /// Método que permite adicionar a equipa de um utilizador logado ao torneio.
        /// </summary>
        /// <param name="id">ID do torneio a ser atualizado.</param>
        /// <returns>Ok 200</returns>
        [HttpPut("{id:int}/addMyTeam"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult AddTeam(int id){
            _service.AddTeam(id, User.Identity.Name);
            return Ok();
        }
    }
}