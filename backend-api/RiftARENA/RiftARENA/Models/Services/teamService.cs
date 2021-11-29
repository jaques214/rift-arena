using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using RiftArena.Models;
using RiftArena.Models.Context;


namespace RiftArena.Services

{
    public interface ITeamService
    {
        Team CreateTeam(Team team);
        IEnumerable<Team> GetAll();
        Team GetByID(long id);
        Team UpdateTeam(int id,Team team);
        void DeleteTeam(long id);
        void AddMember(long id,User user);

    }
    public class teamServices
    {
        private TeamContext _context;

        public teamServices(TeamContext context)
        {
            _context = context;
        }

        public List<Team> GetAll()
        {
            return _context.Team;
        }

        public Team GetByID(long id)
        {
            return _context.Team.Find(id);
        }

        public Team CreateTeam(Team team)
        {
            if (string.IsNullOrWhiteSpace(team.Name))
                throw new AppException("Team name is required");

            if (_context.Team.Any(x => x.Name == team.Name))
                throw new AppException("Team name \"" team.Name + "\" is already taken");

            if (string.IsNullOrWhiteSpace(team.Tag))
                throw new AppException("Team tag is required");

            if (_context.Team.Any(x => x.Tag == team.Tag))
                throw new AppException("Team tag \"" team.Tag + "\" is already taken");


            _context.Team.Add(team);
            _context.SaveChanges();

            
        }

        public Team UpdateTeam(int id,Team team)
        {
            var teamSer = _context.Team.Find(id);
            if (teamSer != null)
                throw new AppException("Team not found!");


            if (team.Name != teamSer.Name)
            {

                if (_context.Team.Any(x => x.Name == team.Name))
                    throw new AppException("Team name " + team.Name + " is already taken");
            }

            if (team.Tag != teamSer.Tag)
            {

                if (_context.Team.Any(x => x.Tag == team.Tag))
                    throw new AppException("Team tag " + team.Tag + " is already taken");
            }

            teamSer.Name = team.Name;
            teamSer.Tag = team.Tag;

            _context.Team.Update(team);
            _context.SaveChanges();
        }

        public void DeleteTeam(long id)
        {
            var team = _context.Team.Find(id);
            if (team != null)
            {
                _context.Team.Remove(team);
                _context.SaveChanges();
            }
        }

        public void AddMember(long id,User user)
        {
            var TeamTemp = GetByID(id);
            if (TeamTemp == null)
            {
                return NoContent();
            }
            else
            {
                if (TeamTemp.NumberMembers == TeamTemp.MAX_MEMBERS )
                {

                }
            }
        }
    }
}