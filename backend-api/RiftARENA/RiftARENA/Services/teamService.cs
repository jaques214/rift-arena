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
            if (string.IsNullOrWhiteSpace(team.Name))
                throw new AppException("Team name is required");

            if (_context.Teams.Any(x => x.Name == team.Name))
                throw new AppException("Team name \"" team.Name + "\" is already taken");

            if (string.IsNullOrWhiteSpace(team.Tag))
                throw new AppException("Team tag is required");

            if (_context.Teams.Any(x => x.Tag == team.Tag))
                throw new AppException("Team tag \"" team.Tag + "\" is already taken");


            _context.Teams.Add(team);
            _context.SaveChanges();

            
        }

        public Team UpdateTeam(int id,Team team)
        {
            var teamSer = _context.Teams.Find(id);
            if (teamSer != null)
                throw new AppException("Team not found!");


            if (team.Name != teamSer.Name)
            {

                if (_context.Teams.Any(x => x.Name == team.Name))
                    throw new AppException("Team name " + team.Name + " is already taken");
            }

            if (team.Tag != teamSer.Tag)
            {

                if (_context.Teams.Any(x => x.Tag == team.Tag))
                    throw new AppException("Team tag " + team.Tag + " is already taken");
            }

            teamSer.Name = team.Name;
            teamSer.Tag = team.Tag;

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