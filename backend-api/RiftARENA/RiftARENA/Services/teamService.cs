using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using RiftArena.Models;
using RiftArena.Models.Contexts;
using RiftARENA.Services;

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
        void RemoveMember(long id, User user);

    }
    public class teamServices
    {

        private RiftArenaContext _context;

        public teamServices(RiftArenaContext context)
        {
            _context = context;
        }

        public IEnumerable<Team> GetAll()
        {
            return _context.RiftArenaTeams.ToList();
        }

        public Team GetByID(long id)
        {
            return _context.RiftArenaTeams.Find(id);
        }

        public Team CreateTeam(Team team)
        {
            if (string.IsNullOrWhiteSpace(team.Name))
                throw new AppException("Team name is required");

            if (_context.RiftArenaTeams.Any(x => x.Name == team.Name))
                throw new AppException("Team name " + team.Name + " is already taken");

            if (string.IsNullOrWhiteSpace(team.Tag))
                throw new AppException("Team tag is required");

            if (_context.RiftArenaTeams.Any(x => x.Tag == team.Tag))
                throw new AppException("Team tag " + team.Tag + " is already taken");


            _context.RiftArenaTeams.Add(team);
            _context.SaveChanges();

            return team;
        }

        public Team UpdateTeam(int id,Team team)
        {
            var teamSer = _context.RiftArenaTeams.Find(id);
            if (teamSer != null)
                throw new AppException("Team not found!");


            if (team.Name != teamSer.Name)
            {

                if (_context.RiftArenaTeams.Any(x => x.Name == team.Name))
                    throw new AppException("Team name " + team.Name + " is already taken");
            }

            if (team.Tag != teamSer.Tag)
            {

                if (_context.RiftArenaTeams.Any(x => x.Tag == team.Tag))
                    throw new AppException("Team tag " + team.Tag + " is already taken");
            }

            teamSer.Name = team.Name;
            teamSer.Tag = team.Tag;

            _context.RiftArenaTeams.Update(team);
            _context.SaveChanges();
            return team;
        }

        public void DeleteTeam(long id)
        {
            var team = _context.RiftArenaTeams.Find(id);
            if (team != null)
            {
                _context.RiftArenaTeams.Remove(team);
                _context.SaveChanges();
            }
        }

        public void AddMember(long id,User user)
        {
            var TeamTemp = GetByID(id);
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
            _context.RiftArenaTeams.Update(TeamTemp);
            _context.SaveChanges();
        }

        public void RemoveMember(long id, User user)
        {
            var TeamTemp = GetByID(id);
            if(TeamTemp == null)
            {
                throw new AppException("Not Found");
            }
            else
            {
                TeamTemp.Members.Remove(user);
                TeamTemp.NumberMembers--;
            }

            _context.RiftArenaTeams.Update(TeamTemp);
            _context.SaveChanges();
        }
    }
}