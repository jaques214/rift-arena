using RiftArena.Models;
using RiftArena.Models.Contexts;
using RiftArena.Models.Services;
using System.Collections.Generic;
using System.Linq;
using System;

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
        List<Team> startTournament(Tournament tournament);
    }

    public class TournamentService : ITournamentService
    {
        private RiftArenaContext _context;

        public TournamentService(RiftArenaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Método que retorna o torneio existente com o nome especificado
        /// </summary>
        /// <returns>O torneio com x nome</returns>
        public Tournament GetByTournamentName(string name)
        {
           return  _context.Tournaments.SingleOrDefault(x => x.Name == name);
        }

        /// <summary>
        /// Método que permite a criação das brackets de um torneio
        /// </summary>
        /// <param name="tournament">Torneio a serem geradas as brackets</param>
        /// <returns>Lista de aleatoriamente misturadas</returns>
        /// <exception cref="AppException">Exceção caso o torneio a criar falhe nas validações</exception>
        public List<Team> startTournament(Tournament tournament)
        {
            if(tournament.Date != DateTime.Now)
            {
                throw new AppException("Not on the scheduled date.");
            }
            else
            {
                Random rng = new Random();
                tournament.State = Status.Online;

                int n = tournament.Stages.Count;

                while (n > 1)
                {
                    n--;
                    int k = rng.Next(n + 1);
                    Team value = tournament.Stages[k];
                    tournament.Stages[k] = tournament.Stages[n];
                    tournament.Stages[n] = value;
                }
            }

            return tournament.Stages;
        }

        /// <summary>
        /// Método que permite passar para a próxima fase do torneio enviando as equipas que passaram
        /// equipas enviadas na lista nexTeams já vêm pela ordem que são selecionadas como vencedoras
        /// logo a equipa da primeira posição sabe que irá jogar com a equipa da segunda posição
        /// </summary>
        /// <param name="tournament">Torneio a serem atualizadas as brackets</param>
        /// <returns>Lista de equipas atualizadas</returns>
        /// <exception cref="AppException">Exceção caso o torneio a criar falhe nas validações</exception>
        public List<Team> nextStage(List<Team> nextTeams,string tournamentName)
        {
            var tournament = GetByTournamentName(tournamentName);

            if (tournament.State != Status.Online)
            {
                throw new AppException("Not able to continue.");
            }
            else
            {
                for (int i = 0; i < tournament.Stages.Count; i++)
                {
                    if (!(nextTeams.Contains(tournament.Stages.ElementAt(i)))){
                        //como saber que é por exemplo a primeira vez que é chamado este método para atribuir à equipa retirada
                        TeamTournament teamTournamentTemp = new TeamTournament();
                        //deveriamos usar team tag e tournament name ? em vez de id ?
                        teamTournamentTemp.TeamId = tournament.Stages.ElementAt(i).TeamId; 
                        teamTournamentTemp.TournamentId = tournament.TournamentId;
                        tournament.Stages.Remove(tournament.Stages.ElementAt(i));
                    }
                }
                tournament.Stages = nextTeams;
                _context.Tournaments.Update(tournament);
                _context.SaveChanges();

                return tournament.Stages;
            }
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
            if (tournament.NumberOfTeams != 4 && tournament.NumberOfTeams != 8 && tournament.NumberOfTeams != 16)
                throw new AppException("The numbers of teams of the tournament should be 4,8 or 16.");
            if (tournament.Rank == null)
                throw new AppException("Choose a rank.");
            if (tournament.Date < System.DateTime.Now)
                throw new AppException("Invalid date.");
            if (tournament.Region == null)
                throw new AppException("Choose a region.");


            var user = _context.Users.SingleOrDefault(x => x.Nickname == userID);

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
                    if (tournament.NumberOfTeams != 4 && tournament.NumberOfTeams != 8 && tournament.NumberOfTeams != 16)
                    {
                        throw new AppException("The numbers of teams of the tournament should be 4, 8 or 16.");
                    }
                    else
                    {
                        tournamentSer.NumberOfTeams = tournament.NumberOfTeams;
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
        /// Método que permite a eliminação de um torneio
        /// </summary>
        /// <param name="id">ID do torneio a eliminar</param>
        /// <param name="userID">ID do utilizador logado</param>
        public void DeleteTournament(int id, string userID)
        {
            var tournament = _context.Tournaments.Find(id);
            if (tournament != null && tournament.CreatorNickname == userID)
            {
                _context.Tournaments.Remove(tournament);
                _context.SaveChanges();
            }
            else
            {
                throw new AppException("User logged in is not the tournament creator.");
            }
        }

        /// <summary>
        /// Método que permite a publicação de um torneio
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
    }
}
