﻿using System;
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
using System.IO;
using System.Net.Http.Headers;


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
        /// <summary>
        /// Método que permite a criação de uma equipa.
        /// </summary>
        /// <param name="team">Equipa a ser criada</param>
        /// <returns>Equipa criada</returns>
        [HttpPost("createTeam"),Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult CreateTeam([FromBody] Team team)
        {
            try
            {
                //mando o id do utilizador logado para o servidor.
                _service.CreateTeam(team, User.Identity.Name);
                _context.SaveChanges();
                return CreatedAtRoute("GetTeam", new { id = team.TeamId }, team);

            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        /// <summary>
        /// Método que retorna um winRate da equipa
        /// </summary>
        /// <param name="tag">tag da equipa a retornar</param>
        /// <returns>WinRate da equipa indicada</returns>
        [HttpPost("CalculateWinRate"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult GetWinRate([FromBody]Team team)
        {
            var winRate = _service.getTeamWinRate(team.Tag);

            return Ok(winRate);
        }

        /// <summary>
        /// Método que retorna uma equipa através de um ID, chamando o método GetByID implementado no teamService
        /// </summary>
        /// <param name="id">ID da equipa a retornar</param>
        /// <returns>Equipa com ID fornecido</returns>
        //GET: api/Teams/{id: int}
        [HttpGet("{id:int}", Name = "GetTeam")]
        public ActionResult<Team> GetByID(int id)
        {

            var teamCon = _service.GetByID(id);
            if (teamCon == null)
                return NotFound();
            else
                return Ok(teamCon);

        }

        /// <summary>
        /// Método que retorna uma equipa através de uma Tag, chamando o método GetByTag implementado no teamService
        /// </summary>
        /// <param name="Tag">Tag da equipa a retornar</param>
        /// <returns>Equipa com Tag fornecida</returns>
        //GET: api/Teams/{Tag}
        [HttpGet("{Tag}", Name = "GetTeamByTag")]
        public ActionResult<Team> GetByTag (string Tag)
        {
            var teamCon = _service.GetByTag(Tag);
            if (teamCon == null)
                return NotFound();
            else
                return Ok(teamCon);
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
            var teamsRestricted = new List<Object>();
            for(int i = 0; i < teamsCon.Count(); i++)
            {
                Team team = teamsCon.ElementAt(i);
                /*JsonObject obj = 
                {
                    "Id": team.TeamId,
                    "tag": team.Tag
                }*/
                //teamsRestricted.Add();
            }
            if (teamsCon == null)
                return NoContent();
            else
                return Ok(teamsCon);
        }

        //DELETE: api/Teams
        /// <summary>
        /// Método que permite a eliminação de uma equipa, chamando o método DeleteTeam implementado no teamService
        /// </summary>
        /// <returns>Ok</returns>
        [HttpDelete,Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        //[HttpDelete("{id:int}")]
        public ActionResult<Team> DeleteTeam()
        {
            _service.DeleteTeam(User.Identity.Name);

            return Ok();
        }

        //PUT: api/Teams/{id}
        /// <summary>
        /// Método que permite a edição de uma equipa, chamando o método UpdateTeam implementado no teamService
        /// </summary>
        /// <param name="team">Equipa com as edições feitas</param>
        /// <returns>Equipa editada</returns>
        [HttpPut, Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult UpdateTeam([FromBody] Team team)
        {
            _service.UpdateTeam(team, User.Identity.Name);
            _context.SaveChanges();

            return Ok();

        }

        //POST: api/Teams/addMember/{id}
        /// <summary>
        /// Método que permite a adição de um membro a uma equipa, chamando o método AddMember implementado no teamService
        /// </summary>
        /// <param name="user">User que será adicionado</param>
        /// <returns>Ok</returns>
        [HttpPost("addMember"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult AddMember([FromBody] User user,int id)
        {
            _service.AddMember(user.Nickname,id);
            _context.SaveChanges();

            return Ok();
        }

        // POST: api/Teams/removeMember
        /// <summary>
        /// Método que permite a remoção de um membro a uma equipa, chamando o método RemoveMember implementado no teamService
        /// </summary>
        /// <param name="user">User que será removido</param>
        /// <returns>Ok</returns>
        [HttpDelete("removeMember"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult RemoveMember([FromBody] User user)
        {
            _service.RemoveMember(user.Nickname, User.Identity.Name);
            _context.SaveChanges();

            return Ok();
        }

        // PUT: api/Teams/leaveTeam
        /// <summary>
        /// Método que permite que um utilizador saia da sua equipa.
        /// </summary>
        /// <param name="userNickname">Nickname do utilizador a substituir caso seja o teamLeader a sair.</param>
        /// <returns>OK 200</returns>
        [HttpPut("leaveTeam"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult LeaveTeam([FromBody] User userNickname){
            _service.LeaveTeam(User.Identity.Name, userNickname);
            return Ok();
        }

    }
}
