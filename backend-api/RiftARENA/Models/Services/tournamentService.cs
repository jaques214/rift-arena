using RiftArena.Models;
using RiftArena.Models.Contexts;
using RiftArena.Models.Services;
using System.Collections.Generic;
using System.Linq;
using System;
using System.IO;

namespace RiftArena.Models.Services
{
    public interface ITournamentService
    {
        Tournament CreateTournament(Tournament tournament, string userID);
        IEnumerable<Tournament> GetAll();
        Tournament GetById(int id);
        Tournament UpdateTournament(int id, Tournament tournament, string userID);
        void DeleteTournament(int id, string userID);
        void PublishTournament(int id, string userID);
        void AddTeam(int id, string userNickname);
    }

    public class TournamentService : ITournamentService
    {
        private RiftArenaContext _context;

        public TournamentService(RiftArenaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Método que retorna todos os torneios existentes
        /// </summary>
        /// <returns>Todos os torneios existentes</returns>
        public IEnumerable<Tournament> GetAll()
        {
            return _context.Tournaments.ToList();
        }

        /// <summary>
        /// Método que retorna um torneio através de um ID
        /// </summary>
        /// <param name="id">ID do torneio a retornar</param>
        /// <returns>Torneio com ID fornecido</returns>
        public Tournament GetById(int id)
        {
            return _context.Tournaments.Find(id);
        }

        /// <summary>
        /// Método que permite a criação de um torneio
        /// </summary>
        /// <param name="tournament">Torneio a ser criado</param>
        /// <returns>Torneio criado</returns>
        /// <exception cref="AppException">Exceção caso o torneio a criar falhe nas validações</exception>
        public Tournament CreateTournament(Tournament tournament, string userID)
        {
            if (string.IsNullOrEmpty(tournament.Name))
                throw new AppException("Tournament name is required.");
            if (tournament.MaxTeams != 4 && tournament.MaxTeams != 8 && tournament.MaxTeams != 16)
                throw new AppException("The numbers of teams of the tournament should be 4,8 or 16.");
            if (tournament.Rank == null)
                throw new AppException("Choose a rank.");
            if (tournament.Date < System.DateTime.Now)
                throw new AppException("Invalid date.");
            if (tournament.Region == null)
                throw new AppException("Choose a region.");


            var user = _context.Users.SingleOrDefault(x => x.Nickname == userID);

            tournament.NumberOfTeams = 0;
            tournament.CreatorNickname = userID;
            tournament.State = Status.NotPublished;
            tournament.Stages = new List<Team>();


            _context.Tournaments.Add(tournament);
            _context.SaveChanges();
            return tournament;
        }

        /// <summary>
        /// Método que permite a edição de um torneio
        /// </summary>
        /// <param name="id">Torneio a ser editado</param>
        /// <param name="tournament">Torneio com edições feitas</param>
        /// <param name="userID">ID do utilizador logado</param>
        /// <returns>Torneio editado</returns>
        /// <exception cref="AppException">Exceção caso a equipa a criar falhe nas validações</exception>
        public Tournament UpdateTournament(int id, Tournament tournament, string userID)
        {
            var tournamentSer = _context.Tournaments.Find(id);

            if (tournamentSer == null)
                throw new AppException("Tournament not found!");

            if (tournamentSer.CreatorNickname == userID)
            {
                if (tournamentSer.State == Status.NotPublished)
                {
                    tournamentSer.Name = tournament.Name;
                    tournamentSer.Description = tournament.Description;
                    if (tournament.MaxTeams != 4 && tournament.MaxTeams != 8 && tournament.MaxTeams != 16)
                    {
                        throw new AppException("The numbers of teams of the tournament should be 4, 8 or 16.");
                    }
                    else
                    {
                        tournamentSer.MaxTeams = tournament.MaxTeams;
                    }
                    tournamentSer.Rank = tournament.Rank;
                    if (tournament.Date > System.DateTime.Now || tournamentSer.Date > System.DateTime.Now)
                    {
                        tournamentSer.Date = tournament.Date;
                    }
                    else
                    {
                        throw new AppException("Invalid date.");
                    }
                    if (tournament.Poster != tournamentSer.Poster)
                    {
                        if (File.Exists(tournamentSer.Poster))
                        {
                            File.Delete(tournamentSer.Poster);
                        }
                    }
                }
                else
                {
                    throw new AppException("Tournament already published");
                }
            }
            else
            {
                throw new AppException("User logged in is not the tournament creator.");
            }

            _context.Tournaments.Update(tournamentSer);
            _context.SaveChanges();
            return GetById(tournamentSer.TournamentId);
        }

        /// <summary>
        /// Método que permite a eliminação de um torneio.
        /// </summary>
        /// <param name="id">ID do torneio a eliminar</param>
        /// <param name="userID">ID do utilizador logado</param>
        public void DeleteTournament(int id, string userID)
        {
            var tournament = _context.Tournaments.Find(id);
            if (tournament != null && tournament.CreatorNickname == userID)
            {
                if (File.Exists(tournament.Poster))
                {
                    File.Delete(tournament.Poster);
                }
                _context.Tournaments.Remove(tournament);
                _context.SaveChanges();
            }
            else
            {
                throw new AppException("User logged in is not the tournament creator.");
            }
        }

        /// <summary>
        /// Método que permite a publicação de um torneio.
        /// </summary>
        /// <param name="id">ID do torneio a ser publicado</param>
        /// <param name="userID">ID do utilizador logado</param>
        public void PublishTournament(int id, string userID)
        {
            var tournament = _context.Tournaments.Find(id);
            if (tournament.CreatorNickname == userID)
            {
                tournament.State = Status.Published;
            }
            else
            {
                throw new AppException("User logged in is not the tournament creator.");
            }
        }

        /// <summary>
        /// Método que permite adicionar uma equipa a um torneio.
        /// </summary>
        /// <param name="id">ID do torneio no qual irá entrar a equipa.</param>
        public void AddTeam(int id, string userNickname)
        {
            var tournament = GetById(id);
            var user = _context.Users.SingleOrDefault(x => x.Nickname == userNickname);

            if (tournament.NumberOfTeams == tournament.MaxTeams)
            {
                throw new AppException("Full tournament, try another.");
            }
            else if (user.TeamTag == null)
            {
                throw new AppException("User does not belong to any team.");
            }
            else
            {
                var team = _context.Teams.SingleOrDefault(x => x.Tag == user.TeamTag);
                if (team.TeamLeader != user.Nickname)
                {
                    throw new AppException("Only teamLeader will be able to register for the tournament.");
                }
                else if (team.Rank != tournament.Rank)
                {
                    throw new AppException("The team's rank is not in agreement.");
                }
                else
                {
                    tournament.Stages.Add(team);
                    team.Tournament.Add(tournament);
                    System.Console.WriteLine(team.Tournament);

                    _context.Teams.Update(team);
                    _context.Tournaments.Update(tournament);
                }
            }

            _context.SaveChanges();
        }

    }
}
