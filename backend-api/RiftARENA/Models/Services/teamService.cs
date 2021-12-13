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
        Team GetByID(int id);
        Team UpdateTeam(int id,Team team);
        void DeleteTeam(int id);
        void AddMember(int id,User user);
        void RemoveMember(int id, User user);

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

        public Team GetByID(int id)
        {
            return _context.Teams.Find(id);
        }

        public Team CreateTeam(Team team)
            //falta usar o token para verificar se o user logado ja esta numa equipa e se ja tem conta vinculada
        {

            if (string.IsNullOrWhiteSpace(team.Name))
                throw new AppException("Team name is required");

            if (_context.Teams.Any(x => x.Name == team.Name))
                throw new AppException("Team name \"" + team.Name + "\" is already taken");

            if (string.IsNullOrWhiteSpace(team.Tag))
                throw new AppException("Team tag is required");

            if (_context.Teams.Any(x => x.Tag == team.Tag))
                throw new AppException("Team tag \"" + team.Tag + "\" is already taken");

            team.TeamLeader = _context.Users.SingleOrDefault(x => x == team.TeamLeader);  
            team.Defeats = 0;
            team.Wins = 0;
            team.TournamentsWon = 0;
            team.GamesPlayed = 0;
            team.NumberMembers = 1;
            //team.Rank = token user getrank(atraves da api)
            //team.Members.Add(team.TeamLeader);

            _context.Teams.Add(team);
            _context.SaveChanges();

            return GetByID(team.TeamId);
            
        }

        public Team UpdateTeam(int id,Team team)
        {
            var teamSer = GetByID(id);
            if (teamSer == null)
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
            teamSer.Rank = team.Rank;


            _context.Teams.Update(team);
            _context.SaveChanges();

            return GetByID(team.TeamId);
        }

        public void DeleteTeam(int id)
        {
            var team = _context.Teams.Find(id);
            if (team != null)
            {
                _context.Teams.Remove(team);
                _context.SaveChanges();
            }
        }

        public void AddMember(int id,User user)
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
            _context.Teams.Update(TeamTemp);
            _context.SaveChanges();
        }

        public void RemoveMember(int id, User user)
        {
            //falta usar o token para verificar se o user logado é team leader
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

            _context.Teams.Update(TeamTemp);
            _context.SaveChanges();
        }


        //criar metodo para calcular rank
    }
}