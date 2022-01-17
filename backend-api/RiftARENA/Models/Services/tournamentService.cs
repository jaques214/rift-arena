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
        Tournament startTournament(Tournament tournament);
        Tournament nextStage(List<string> nextTeams, int id);
        List<TeamTournament> GetTeamsAndStageByTournament(int id);
    }

    public class TournamentService : ITournamentService
    {
        private RiftArenaContext _context;
        private readonly ITeamService _teamService;

        public TournamentService(RiftArenaContext context, ITeamService teamService)
        {
            _context = context;
            _teamService = teamService;
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
        public Tournament startTournament(Tournament tournament)
        {
            var tournamentTemp = GetById(tournament.TournamentId);
            //passar isto para enum na classe Tournament
            string[] v4Temp = new string[] { "4", "2", "1" };
            string[] v8Temp = new string[] { "8", "4", "2", "1" };
            string[] v16Temp = new string[] { "16", "8", "4", "2", "1" };

           /* if (tournament.Date != DateTime.Now)
            {
                throw new AppException("Not on the scheduled date.");
            }
            else
            {*/
                if(tournamentTemp.NumberOfTeams != tournamentTemp.MaxTeams)
                {
                tournamentTemp.State = Status.Canceled;
                    throw new AppException("Not enough teams to play, tournament canceled.");
                }
                else
                {
                  if(tournamentTemp.State == Status.Published)
                  {

                    Random rng = new Random();
                    tournamentTemp.State = Status.Online;

                    int n = tournamentTemp.Stages.Count;

                    while (n > 1)
                    {
                        n--;
                        int k = rng.Next(n + 1);
                        Team value = tournamentTemp.Stages[k];
                        tournamentTemp.Stages[k] = tournamentTemp.Stages[n];
                        tournamentTemp.Stages[n] = value;
                    }
                    if (tournamentTemp.MaxTeams == 4)
                    {
                        tournamentTemp.Stage = v4Temp.First();

                    }
                    else if (tournamentTemp.MaxTeams == 8)
                    {
                        tournamentTemp.Stage = v8Temp.First();
                    }
                    else
                    {
                        tournamentTemp.Stage = v16Temp.First();
                    }

                  }
                  else
                  {
                    throw new AppException("Tournament not published yet.");
                  }
                   
                }

            //}
            _context.Tournaments.Update(tournamentTemp);
            _context.SaveChanges(); 

            return tournament;
        }

        /// <summary>
        /// Método que permite passar para a próxima fase do torneio enviando as equipas que passaram
        /// equipas enviadas na lista nexTeams já vêm pela ordem que são selecionadas como vencedoras
        /// logo a equipa da primeira posição sabe que irá jogar com a equipa da segunda posição
        /// </summary>
        /// <param name="tournament">Torneio a serem atualizadas as brackets</param>
        /// <returns>Lista de equipas atualizadas</returns>
        /// <exception cref="AppException">Exceção caso o torneio a criar falhe nas validações</exception>
        public Tournament nextStage(List<string> nextTeams,int id)
        {
            //passar isto para enum na classe Tournament
            //Testar
            string[] v4Temp = new string[] { "4", "2", "1" };
            string[] v8Temp = new string[] { "8", "4", "2","1" };
            string[] v16Temp = new string[] { "16", "8", "4", "2", "1" };

            var tournament = GetById(id);
            

            if (tournament.State != Status.Online)
            {
                throw new AppException("Not able to continue.");
            }
            else
            {
                List<Team> nextTeamsTemp = new List<Team>();    

                for(int j = 0;j< nextTeams.Count; j++)
                {
                    var team = _teamService.GetByTag(nextTeams.ElementAt(j));
                    nextTeamsTemp.Add(team);
                }

                for (int i = 0; i < tournament.Stages.Count; i++)
                {
                    if (!(nextTeamsTemp.Contains(tournament.Stages.ElementAt(i)))){

                        TeamTournament teamTournamentTemp = new TeamTournament();
                        
                        var team = _teamService.GetByTag(tournament.Stages.ElementAt(i).Tag);
                        team.Defeats++;

                        teamTournamentTemp.TeamId = tournament.Stages.ElementAt(i).TeamId; 
                        teamTournamentTemp.TournamentId = tournament.TournamentId;
                        teamTournamentTemp.Position = Int32.Parse(tournament.Stage);
                        tournament.Stages.Remove(tournament.Stages.ElementAt(i));

                        _context.TeamTournaments.Add(teamTournamentTemp);
                        _context.Teams.Update(team);
                        _context.SaveChanges();
                    }
                }
                tournament.Stages = nextTeamsTemp;
                setTeamWins(nextTeamsTemp);
                var index = FindStage(v4Temp, tournament.Stage);

                if (tournament.Stages.Count == 1)
                {
                    tournament.FinalWinner = tournament.Stages.First().Tag;
                    var winner = _teamService.GetByTag(tournament.Stages.First().Tag);
                    winner.TournamentsWon++;
                    tournament.State = Status.Closed;

                    _context.Teams.Update(winner);
                    _context.SaveChanges();
                    
                }
                else
                {
                    if (index == -1)
                    {
                        throw new Exception("Erro que não devia dar");
                    }
                    else
                    {
                        if (tournament.MaxTeams == 4)
                        {
                            tournament.Stage = v4Temp[index + 1];
                        }

                        if (tournament.MaxTeams == 8)
                        {
                            tournament.Stage = v8Temp[index + 1];
                        }

                        if (tournament.MaxTeams == 16)
                        {
                            tournament.Stage = v16Temp[index + 1];
                        }

                    }
                }

                _context.Tournaments.Update(tournament);
                _context.SaveChanges();

                return tournament;
            }
        }

        public List<TeamTournament> GetTeamsAndStageByTournament(int id)
        {
            var x = _context.TeamTournaments.Where(x => x.TournamentId == id);
            Console.WriteLine(x.ToString());
            
            return x.ToList();
        }

        /// <summary>
        /// Método que atribui as estatisticas de vitorias às equipas que passam
        /// </summary>
        public void setTeamWins(List<Team> teams)
        {
            for (int i = 0; i < teams.Count; i++)
            {
                teams.ElementAt(i).Wins++;
                
                _context.Teams.Update(teams.ElementAt(i)); 
                _context.SaveChanges();

            }
        }


        /// <summary>
        /// Método que retorna todos o indice do stage atual
        /// </summary>
        /// <returns>Índice do stage atual</returns>
        public int FindStage(string[] vX,string stageAtual)
        {
            for(int i = 0; i < vX.Length; i++)
            {
                if(vX[i] == stageAtual) return i;
            }
            return -1;
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
                    if (tournament.MaxTeams != 0)
                    {
                        if (tournament.MaxTeams != 4 && tournament.MaxTeams != 8 && tournament.MaxTeams != 16)
                        {
                            throw new AppException("The numbers of teams of the tournament should be 4, 8 or 16.");
                        }
                        else
                        {
                            tournamentSer.MaxTeams = tournament.MaxTeams;
                        }
                    }
                    tournamentSer.Rank = tournament.Rank;
                    if (tournament.Date > System.DateTime.Now)
                    {
                        tournamentSer.Date = tournament.Date;
                    }
                    else
                    {
                        if (tournamentSer.Date < System.DateTime.Now)
                        {
                            throw new AppException("Invalid date.");
                        }

                    }
                    if (tournament.Poster != tournamentSer.Poster)
                    {
                        if (File.Exists(tournamentSer.Poster))
                        {
                            File.Delete(tournamentSer.Poster);
                        }
                    }
                    if(tournament.Region != null){
                        tournamentSer.Region = tournament.Region;
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
                var teamLeader = _context.Users.SingleOrDefault(x => x.Nickname == team.TeamLeader);

                if (team.TeamLeader != user.Nickname)
                {
                    throw new AppException("Only teamLeader will be able to register for the tournament.");
                }
                else if (team.Rank != tournament.Rank)
                {
                    throw new AppException("The team's rank is not in agreement.");
                }
                else if (teamLeader.LinkedAccount.Region != tournament.Region)
                {
                    throw new AppException("The team region does not belong to the tournament region.");
                }
                else
                {
                    tournament.Stages.Add(team);
                    team.Tournament.Add(tournament);
                    tournament.NumberOfTeams++;

                    _context.Teams.Update(team);
                    _context.Tournaments.Update(tournament);
                }
            }

            _context.SaveChanges();
        }

    }
}
