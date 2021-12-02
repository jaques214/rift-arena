using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using RiftArena.Models;
using RiftArena.Models.Contexts;

namespace RiftArena.Models.Services
{
    public interface ITeamService
    {
        Team CreateTeam(Team team);
        IEnumerable<Team> GetAll();
        Team GetByTag(string Tag);
        Team UpdateTeam(string Tag,Team team);
        void DeleteTeam(string Tag);
        void AddMember(string Tag,User user);
        void RemoveMember(string Tag, User user);

    }
    public class TeamServices : ITeamService
    {
        private RiftArenaContext _context;

        public TeamServices(RiftArenaContext context)
        {
            _context = context;
        }

        public IEnumerable<Team> GetAll()
        {
            return  _context.Teams.ToList();
        }

        public Team GetByTag(string Tag)
        {
            return _context.Teams.SingleOrDefault(x => x.Tag == Tag);
        }

        public Team CreateTeam(Team team)
        {
            if (string.IsNullOrWhiteSpace(team.Name))
                throw new AppException("Team name is required");

            if (_context.Teams.Any(x => x.Name == team.Name))
                throw new AppException("Team name \"" + team.Name + "\" is already taken");

            if (string.IsNullOrWhiteSpace(team.Tag))
                throw new AppException("Team tag is required");

            if (_context.Teams.Any(x => x.Tag == team.Tag))
                throw new AppException("Team tag \"" + team.Tag + "\" is already taken");


            _context.Teams.Add(team);
            _context.SaveChanges();

            return GetByTag(team.Tag);
            
        }

        public Team UpdateTeam(string Tag,Team team)
        {
            var teamSer = _context.Teams.Find(Tag);
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

            return GetByTag(team.Tag);
        }

        public void DeleteTeam(string Tag)
        {
            var team = _context.Teams.Find(Tag);
            if (team != null)
            {
                _context.Teams.Remove(team);
                _context.SaveChanges();
            }
        }

        public void AddMember(string Tag,User user)
        {
            var TeamTemp = GetByTag(Tag);
            if (TeamTemp == null)
            {
                throw new AppException("Not Found");
            }
            else
            {
                if (TeamTemp.NumberMembers == TeamTemp.MAX_MEMBERS)
                {
                    throw new AppException("Team full");
                }
                else
                {
                    TeamTemp.Members.Add(user);
                    TeamTemp.NumberMembers++;
                }
            }
            _context.Teams.Update(TeamTemp);
            _context.SaveChanges();
        }

        public void RemoveMember(string Tag, User user)
        {
            var TeamTemp = GetByTag(Tag);
            if(TeamTemp == null)
            {
                throw new AppException("Not Found");
            }
            else
            {
                TeamTemp.Members.Remove(user);
                TeamTemp.NumberMembers--;
            }

            _context.Teams.Update(TeamTemp);
            _context.SaveChanges();
        }
    }
}