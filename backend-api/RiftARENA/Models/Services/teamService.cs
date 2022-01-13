using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using RiftArena.Models;
using RiftArena.Models.Contexts;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace RiftArena.Models.Services
{
    public interface ITeamService
    {
        Team CreateTeam(Team team, string userID);
        IEnumerable<Team> GetAll();
        Team GetByID(int id);
        Team UpdateTeam(Team team, string userID);
        void DeleteTeam(string userID);
        void LeaveTeam(string UserID, User user);
        void AddMember(string nickname, int id);
        void RemoveMember(string nickname, string userID);
        Team GetByTag(string Tag);

    }
    public class TeamServices : ITeamService
    {
        private RiftArenaContext _context;

        private readonly IWebHostEnvironment _env;
        public TeamServices(RiftArenaContext context, IWebHostEnvironment env)
        {
            _context = context;
            this._env = env;
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
        {
            team.Members = new List<User>();
            var leader = _context.Users.SingleOrDefault(x => x.Nickname == userID);

            if(leader.TeamTag != null)
                throw new AppException("Already has a team");

            if (leader.LinkedAccount == null)
                throw new AppException("Linked Account is required");

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




            team.TeamLeader = leader.Nickname;
            team.Members.Add(leader);
            team.Defeats = 0;
            team.Wins = 0;
            team.TournamentsWon = 0;
            team.GamesPlayed = 0;
            team.NumberMembers = 1;
            team.Rank = leader.LinkedAccount.Rank;




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

            if (team.Poster != teamSer.Poster)
            {
                if (File.Exists(teamSer.Poster))
                {
                    File.Delete(teamSer.Poster);
                }
            }

            teamSer.Name = team.Name;
            teamSer.Tag = team.Tag;


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

                for (int i = 0; i < team.Members.Count; i++)
                {
                    team.Members[i].TeamTag = null;
                    _context.Users.Update(team.Members[i]);
                }
                if (File.Exists(team.Poster))
                {
                    File.Delete(team.Poster);
                }


                _context.Teams.Remove(team);
                _context.SaveChanges();
            }
        }

        /// <summary>
        /// Método que permite a adição de um membro a uma equipa
        /// </summary>
        /// <param name="user">User que será adicionado</param>
        /// <exception cref="AppException">Exceção caso a equipa não exista ou esteja cheia</exception>
        public void AddMember(string nickname,int id)
        {
            var user = _context.Users.SingleOrDefault(x => x.Nickname == nickname);
            var TeamTemp = _context.Teams.Find(id);
            var teamLeader = _context.Users.SingleOrDefault(x => x.Nickname == TeamTemp.TeamLeader);
            if (TeamTemp == null)
            {
                throw new AppException("Not Found");
            }
            else if(TeamTemp.NumberMembers == TeamTemp.MAX_MEMBERS)
                {
                    throw new AppException("Team full");
                }
                else if(user.LinkedAccount == null)
                {
                    throw new AppException("Linked Account is required");
                }
                else if (user.LinkedAccount.Region != teamLeader.LinkedAccount.Region)
                    {
                throw new AppException("User region does not match team leader region");
            }
                    else
                        {
                            user.TeamTag = TeamTemp.Tag;
                            TeamTemp.Members.Add(user);
                            TeamTemp.NumberMembers++;
                            TeamTemp.Rank = GetRankMean(TeamTemp.TeamId);
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
        public void RemoveMember(string nickname, string userID)
        {
            var user = _context.Users.SingleOrDefault(x => x.Nickname == nickname);
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
                    user.TeamTag = null;
                    TeamTemp.Members.Remove(user);
                    TeamTemp.NumberMembers--;
                    TeamTemp.Rank = GetRankMean(TeamTemp.TeamId);
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

            

            if (TeamTemp.TeamLeader == userTemp.Nickname)
            {
                var userSubstitute = _context.Users.SingleOrDefault(x => x.Nickname == user.Nickname);
                if (user.Nickname == null)
                {
                    throw new AppException("Team leader cannot be removed without substitute.");
                }
                else if(TeamTemp.Members.Contains(userSubstitute))
                {
                    userTemp.TeamTag = null;
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


        /// Método que permite calcular a média de rank da equipa
        /// </summary>
        /// <param name="id">Id da equipa a calcular a média de rank</param>
        /// <returns>Rank médio</returns>
        public string GetRankMean (int id)
        {
            var Rank = "";
            var TeamTemp = GetByID (id);
            var x = 0;
            var Ranktemp = 0;


            for (int i = 0; i < TeamTemp.Members.Count; i++)
            {
                switch (TeamTemp.Members[i].LinkedAccount.Rank){
                    case "IRON":
                        x = x + 1;
                        break;
                    case "BRONZE":
                        x = x + 2;
                        break;
                    case "SILVER":
                        x = x + 3;
                        break;
                    case "GOLD":
                        x = x + 4;
                        break;
                    case "PLATINUM":
                        x = x + 5;
                        break;
                    case "DIAMOND":
                        x = x + 6;
                        break;
                    case "MASTER":
                        x = x + 7;
                        break;
                    case "GRANDMASTER":
                        x = x + 8;
                        break;
                    case "CHALLENGER":
                        x = x + 9;
                        break;
                    default:
                        x = 0;
                        break;

                }
            }
            Ranktemp = x / TeamTemp.Members.Count;

            switch (Ranktemp)
            {
                case 1:
                    Rank = "IRON";
                    break;
                case 2:
                    Rank = "BRONZE";
                    break;
                case 3:
                    Rank = "SILVER";
                    break;
                case 4:
                    Rank = "GOLD";
                    break;
                case 5:
                    Rank = "PLATINUM";
                    break;
                case 6:
                    Rank = "DIAMOND";
                    break;
                case 7:
                    Rank = "MASTER";
                    break;
                case 8:
                    Rank = "GRANDMASTER";
                    break;
                case 9:
                    Rank = "CHALLENGER";
                    break;
            }

            return Rank;
        }

    }
}