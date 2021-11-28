using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiftArena.Models;
using RiftArenaAPI.Models.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;


namespace RiftArenaAPI.Services

{
    public interface ITeamService
    {
        Team CreateTeam(Team team);
        IEnumerable<Team> GetAll();
        Team GetByID(long id);
        Team UpdateTeam(int id,Team team);
        void DeleteTeam(long id);

    }
    public class teamServices
    {
        private TeamContext _context;

        public teamServices(TeamContext context)
        {
            _context = context;
        }

        public IEnumerable<Team> GetAll()
        {
            return _context.Teams;
        }

        public Team GetByID(long id)
        {
            return _context.Teams.Find(id);
        }

        public Team CreateTeam(Team team)
        {
            if (string.IsNullOrWhiteSpace(team.TeamName))
                throw new AppException("TeamName is required");

            if (_context.Teams.Any(x => x.TeamName == team.TeamName))
                throw new AppException("TeamName \"" team.TeamName + "\" is already taken");

            if (string.IsNullOrWhiteSpace(team.TeamTag))
                throw new AppException("TeamTag is required");

            if (_context.Teams.Any(x => x.TeamTag == team.TeamTag))
                throw new AppException("TeamTag \"" team.TeamTag + "\" is already taken");


            _context.Teams.Add(team);
            _context.SaveChanges();

            
        }

        public Team UpdateTeam(int id,Team team)
        {
            var teamSer = _context.Teams.Find(id);
            if (teamSer != null)
                throw new AppException("Team not found!");


            if (team.TeamName != teamSer.TeamName)
            {

                if (_context.Teams.Any(x => x.TeamName == team.TeamName))
                    throw new AppException("TeamName " + team.TeamName + " is already taken");
            }

            if (team.TeamTag != teamSer.TeamTag)
            {

                if (_context.Teams.Any(x => x.TeamTag == team.TeamTag))
                    throw new AppException("TeamTag " + team.TeamTag + " is already taken");
            }

            teamSer.TeamName = team.TeamName;
            teamSer.TeamTag = team.TeamTag;

            _context.Teams.Update(team);
            _context.SaveChanges();
        }

        public void DeleteTeam(long id)
        {
            var team = _context.Teams.Find(id);
            if (team != null)
            {
                _context.Teams.Remove(team);
                _context.SaveChanges();
            }
        }
    }
}