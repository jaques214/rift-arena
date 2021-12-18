﻿using RiftArena.Models;
using RiftArena.Models.Contexts;
using RiftArena.Models.Services;
using System.Collections.Generic;
using System.Linq;

namespace RiftArena.Models.Services
{
    public interface ITournamentService
    {
        Tournament CreateTournament(Tournament tournament);
        IEnumerable<Tournament> GetAll();
        Tournament GetById(int id);
        Tournament UpdateTournament(int id, Tournament tournament);
        void DeleteTournament(int id);
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
        public Tournament CreateTournament(Tournament tournament)
        {
            if (string.IsNullOrEmpty(tournament.Name))
                throw new AppException("Tournament name is required.");
            if (tournament.NumberOfTeams != 8 && tournament.NumberOfTeams != 16 && tournament.NumberOfTeams != 32)
                throw new AppException("The numbers of teams of the tournament should be 8,16 or 32.");
            if (tournament.Rank == null)
                throw new AppException("Choose a rank.");
            if (tournament.date < System.DateTime.Now && tournament.date == null) 
                throw new AppException("Invalid date.");

            //falta buscar região pelo user
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
        /// <returns>Torneio editado</returns>
        /// <exception cref="AppException">Exceção caso a equipa a criar falhe nas validações</exception>
        public Tournament UpdateTournament(int id, Tournament tournament)
        {
            var tournamentSer = _context.Tournaments.Find(id);
            if (tournamentSer == null)
                throw new AppException("Tournament not found!");

            if (tournamentSer.State.Equals("Not Published"))
            {
                tournamentSer.Name = tournament.Name;
                tournamentSer.Description = tournament.Description;
                tournamentSer.NumberOfTeams = tournament.NumberOfTeams;
                tournamentSer.Rank = tournament.Rank;
                if(tournament.date > System.DateTime.Now || tournamentSer.date < System.DateTime.Now){
                    tournamentSer.date = tournament.date;
                } else {
                    throw new AppException("Invalid date.");
                }
            }
            else
            {
                throw new AppException("Tournament already published");
            }

            _context.Tournaments.Update(tournament);
            _context.SaveChanges();
            return tournament;
        }

        /// <summary>
        /// Método que permite a eliminação de um torneio
        /// </summary>
        /// <param name="id">ID do torneio a eliminar</param>
        public void DeleteTournament(int id)
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
