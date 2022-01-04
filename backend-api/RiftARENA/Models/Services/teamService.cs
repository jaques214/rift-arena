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
        Team CreateTeam(Team team, string userID);
        IEnumerable<Team> GetAll();
        Team GetByID(int id);
        Team UpdateTeam(Team team, string userID);
        void DeleteTeam(string userID);
        void AddMember(User user, int id);
        void RemoveMember(User user, string userID);
        void LeaveTeam(string UserID, User user);
        Team GetByTag(string Tag);

    }
    public class TeamServices : ITeamService
    {
        private RiftArenaContext _context;

        public TeamServices(RiftArenaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Método que retorna todas as equipas existentes
        /// </summary>
        /// <returns>Todas as equipas existentes</returns>
        public IEnumerable<Team> GetAll()
        {
            return _context.Teams.ToList();
        }

        /// <summary>
        /// Método que retorna uma equipa através de um ID
        /// </summary>
        /// <param name="id">ID da equipa a retornar</param>
        /// <returns>Equipa com ID fornecido</returns>
        public Team GetByID(int id)
        {
            return _context.Teams.Find(id);
        }

        /// <summary>
        /// Método que retorna uma equipa através de uma tag
        /// </summary>
        /// <param name="tag">tag da equipa a retornar</param>
        /// <returns>Equipa com tag fornecido</returns>
        public Team GetByTag(string Tag)
        {
            return _context.Teams.SingleOrDefault(x => x.Tag == Tag);
        }

        /// <summary>
        /// Método que permite a criação de uma equipa
        /// </summary>
        /// <param name="team">Equipa a ser criada</param>
        /// <returns>Equipa criada</returns>
        /// <exception cref="AppException">Exceção caso a equipa a criar falhe nas validações</exception>
        public Team CreateTeam(Team team, string userID)
        //falta usar o token para verificar se o user logado ja esta numa equipa e se ja tem conta vinculada
        {
            team.Members = new List<User>();

            if (string.IsNullOrWhiteSpace(team.Name))
                throw new AppException("Team name is required");

            if (_context.Teams.Any(x => x.Name == team.Name))
                throw new AppException("Team name \"" + team.Name + "\" is already taken");

            if (string.IsNullOrWhiteSpace(team.Tag))
                throw new AppException("Team tag is required");

            if (team.Tag.Length != 3)
                throw new AppException("TAG should contain only 3 letters");

            if (_context.Teams.Any(x => x.Tag == team.Tag))
                throw new AppException("Team tag \"" + team.Tag + "\" is already taken");

            if (_context.Teams.Any(x => x.TeamLeader == team.TeamLeader))
                throw new AppException("TeamLeader\"" + team.TeamLeader + "\"is already taken");


            var leader = _context.Users.SingleOrDefault(x => x.Nickname == userID);

            team.TeamLeader = leader.Nickname;
            team.Members.Add(leader);
            team.Defeats = 0;
            team.Wins = 0;
            team.TournamentsWon = 0;
            team.GamesPlayed = 0;
            team.NumberMembers = 1;
            team.Rank = leader.Rank;

            _context.Teams.Add(team);

            leader.TeamTag = team.Tag;
            _context.Users.Update(leader);

            _context.SaveChanges();

            return GetByID(team.TeamId);

        }

        /// <summary>
        /// Método que permite a edição de uma equipa
        /// </summary>
        /// <param name="team">Equipa com as edições feitas</param>
        /// <returns>Equipa editada</returns>
        /// <exception cref="AppException">Exceção caso a equipa a editar falhe nas validações</exception>
        public Team UpdateTeam(Team team, string userID)
        {
            var teamSer = _context.Teams.FirstOrDefault(x => x.TeamLeader == userID);
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


            _context.Teams.Update(teamSer);
            _context.SaveChanges();

            return GetByID(teamSer.TeamId);
        }

        /// <summary>
        /// Método que permite a eliminação de uma equipa
        /// </summary>
        public void DeleteTeam(string userID)
        {
            var team = _context.Teams.SingleOrDefault(x => x.TeamLeader == userID);
            if (team != null)
            {
                //colocar o team dos members a null
                _context.Teams.Remove(team);
                _context.SaveChanges();
            }
        }

        /// <summary>
        /// Método que permite a adição de um membro a uma equipa
        /// </summary>
        /// <param name="user">User que será adicionado</param>
        /// <exception cref="AppException">Exceção caso a equipa não exista ou esteja cheia</exception>
        public void AddMember(User user,int id)
        {
            var TeamTemp = _context.Teams.Find(id);
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

        /// <summary>
        /// Método que permite a remoção de um membro a uma equipa
        /// </summary>
        /// <param name="id">ID da equipa que o user será removido</param>
        /// <param name="user">User que será removido</param>
        /// <exception cref="AppException">Exceção caso a equipa não exista ou o user a ser removido seja o team leader</exception>
        public void RemoveMember(User user, string userID)
        {
            var TeamTemp = _context.Teams.SingleOrDefault(x => x.TeamLeader == userID);
            if (TeamTemp == null)
            {
                throw new AppException("Not Found");
            }
            else
            {
                if (TeamTemp.TeamLeader.Equals(user.Nickname))
                {
                    throw new AppException("Team leader cannot be removed");
                }
                else
                {
                    TeamTemp.Members.Remove(user);
                    TeamTemp.NumberMembers--;
                }
            }
            _context.Teams.Update(TeamTemp);
            _context.SaveChanges();
        }

        /// <summary>
        /// Método que permite que um utilizador saia da sua equipa.
        /// </summary>
        /// <param name="UserID">User logado que pretende sair da equipa</param>
        /// <param name="user">Nickname do utilizador a substituir caso seja o teamLeader a sair.</param>
        public void LeaveTeam(string UserID, User user)
        {
            var userTemp = _context.Users.SingleOrDefault(x => x.Nickname == UserID);
            var TeamTemp = GetByTag(userTemp.TeamTag);

            var userSubstitute = _context.Users.SingleOrDefault(x => x.Nickname == user.Nickname);

            if (TeamTemp.TeamLeader == userTemp.Nickname)
            {
                if (user.Nickname == null)
                {
                    throw new AppException("Team leader cannot be removed without substitute.");
                }
                else if(TeamTemp.Members.Contains(userSubstitute))
                {
                    TeamTemp.Members.Remove(userTemp);
                    TeamTemp.NumberMembers--;
                    TeamTemp.TeamLeader = user.Nickname;
                } else {
                    throw new AppException("The substituted does not belong to the team.");
                }
            }
            else
            {
                userTemp.TeamTag = null;
                TeamTemp.Members.Remove(userTemp);
                TeamTemp.NumberMembers--;
            }

            _context.Teams.Update(TeamTemp);
            _context.SaveChanges();
        }

        //criar metodo para calcular rank
    }
}