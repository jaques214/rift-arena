using RiftArena.Models;
using RiftArena.Models.Contexts;
using RiftArena.Models.Services;
using System.Collections.Generic;
using System.Linq;

namespace RiftARENA.Services
{
    public interface ITournamentService
    {
        Tournament CreateTournament(Tournament tournament);
        IEnumerable<Tournament> GetAll();
        Tournament GetById(long id);
        Tournament UpdateTournament(long id, Tournament tournament);
        void DeleteTournament(long id);
        void populateStages(List<Team> Stages);
        void popStages(List<Team> Stages);
    }

    public class tournamentService
    {
        private RiftArenaContext _context;

        public tournamentService(RiftArenaContext context)
        {
            _context = context;
        }

        public IEnumerable<Tournament> GetAll()
        {
            return _context.Tournaments.ToList();
        }

        public Tournament GetById(long id)
        {
            return _context.Tournaments.Find(id);
        }

        public Tournament CreateTournament(Tournament tournament)
        {
            if (string.IsNullOrEmpty(tournament.Name))
                throw new AppException("Tournament name is required");
            if (tournament.NumberOfTeams != 8 && tournament.NumberOfTeams != 16 && tournament.NumberOfTeams != 32)
                throw new AppException("The numbers of teams of the tournament should be 8,16 or 32");
            if (tournament.Rank == null)
                throw new AppException("Choose a rank");


            _context.Tournaments.Add(tournament);
            _context.SaveChanges();
            return tournament;
        }

        public Tournament UpdateTournament(long id, Tournament tournament)
        {
            var tournamentSer = _context.Tournaments.Find(id);
            if (tournamentSer == null)
                throw new AppException("Tournament not found!");

            if (tournamentSer.State.Equals("Not Published"))
            {
                tournamentSer.Name = tournament.Name;
                tournamentSer.NumberOfTeams = tournament.NumberOfTeams;
                tournament.Rank = tournament.Rank;
            }
            else
            {
                throw new AppException("Tournament already published");
            }

            _context.Tournaments.Update(tournament);
            _context.SaveChanges();
            return tournament;
        }


        public void DeleteTournament(long id)
        {
            var tournament = _context.Tournaments.Find(id);
            if (tournament != null)
            {
                _context.Tournaments.Remove(tournament);
                _context.SaveChanges();
            }
        }
    }
}
