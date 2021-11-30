﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiftArena.Models;
using RiftArena.Models.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RiftARENA.Services
    //TO DO 
    //Add Hashs da Password
{
    //Interface de UserService com os métodos e funções a implementar
    public interface IUserService
    {
        User Authenticate(string username, string password);
        IEnumerable<User> GetAll();
        User GetById(int id);
        User Create(User user, string password);
        void Update(User user, string password = null);
        void Delete(int id);
    }
    public class userServices
    {
        //Contexto da BD
        private RiftArenaContext _context;

        public userServices(RiftArenaContext context)
        {
            _context = context;
        }

        //Retorna todos os utilizadores registados 
        public IEnumerable<User> GetAll()
        {
            return _context.RiftArenaUsers.ToList();
        }

        //Retorna um utilizador apartir de um ID
        public User GetById(long id)
        {
            return _context.RiftArenaUsers.Find(id);
        }

        //Atualiza as informações de um utilizador apartir de determinado ID
        public void Update(User userParam, string password = null)
        {
            var user = _context.RiftArenaUsers.Find(userParam.UserID);

            if (user == null)
                throw new AppException("User not found");

            if (userParam.Nickname != user.Nickname)
            {
                // username has changed so check if the new username is already taken
                if (_context.RiftArenaUsers.Any(x => x.Nickname == userParam.Nickname))
                    throw new AppException("Username " + userParam.Nickname + " is already taken");
            }

            user.Name = userParam.Name;
            user.Email = userParam.Email;
            user.Nickname = userParam.Nickname;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                //user.PasswordHash = passwordHash;
                //user.PasswordSalt = passwordSalt;
            }

            _context.RiftArenaUsers.Update(user);
            _context.SaveChanges();
        }

        //Remove um utilizador apartir de determinado ID
        public void Delete(long id)
        {
            var user = _context.RiftArenaUsers.Find(id);
            if (user != null)
            {
                _context.RiftArenaUsers.Remove(user);
                _context.SaveChanges();
            }
        }
        //Cria um novo utilizador com as informações recebidas 
        public User Create(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            if (string.IsNullOrWhiteSpace(user.Nickname))
                throw new AppException("Nickname is required");

            if (_context.RiftArenaUsers.Any(x => x.Nickname == user.Nickname))
                throw new AppException("Username \"" + user.Nickname + "\" is already taken");

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            //user.PasswordHash = passwordHash;
            //user.PasswordSalt = passwordSalt;

            _context.RiftArenaUsers.Add(user);
            _context.SaveChanges();

            return user;
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

    }
}
