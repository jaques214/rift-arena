using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiftArena.Models;
using RiftArena.Models.Contexts;
using RiftARENA.Models.API;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RiftArena.Models.Services
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
        User LinkRiot(int userID, string nickname, string region);
        void ValidateRiot(LinkedAccount linked);
        bool CheckValidatedRiot(LinkedAccount linked);
        User UnlinkRiot(int userID);
        List<Request> GetAllRequestsOfUserById(int userID);

    }
    public class UserServices : IUserService
    {
        private RiftArenaContext _context;
        

        public UserServices(RiftArenaContext context)
        {
            _context = context;
        }

        //Retorna uma lista com os pedidos de um determinado User
        public List<Request> GetAllRequestsOfUserById(int userID)
        {
            User userTemp = GetById(userID);

            if(userTemp == null)
            {           
                throw new AppException("Account not found");
                return null;
            }
            else
            {
                return userTemp.Requests;
            }
        }

        //Verifica se o Summoner Existe na riot api
        public bool VerifySummoner(string region,string summonerName)
        {
            Summoner_V4 summoner_v4 = new Summoner_V4(region);

            var summoner = summoner_v4.GetSummonerByName(summonerName);
            
            return summoner != null;
        }

        //Conecta a conta riot retornando já o user atualizado e confirma a validação pelo Icon
        public User LinkRiot(int userID, string nickname,string region)
        {
            User userTemp = GetById(userID);
            

            if (userTemp != null)
            {
                Summoner_V4 summoner_v4 = new Summoner_V4(region);
                var summoner = summoner_v4.GetSummonerByName(nickname);
                

                if (summoner == null)
                {
                    throw new AppException("Riot account not found");  
                }
                
                var linkedTemp = new LinkedAccount
                {
                    Username = nickname,
                    User = userTemp,
                    profileIconID = summoner.profileIconId,
                    Region = region,
                    ID = summoner.id,
                    summonerLevel = summoner.summonerLevel,
                    validated = false
                };

                if (CheckValidatedRiot(linkedTemp))
                {
                    linkedTemp.validated = true;
                }

            }
            else
            {
                throw new AppException("User not found");
            }

            return null;
        }

        //Muda o estado da conta para validada
        public void ValidateRiot(LinkedAccount linked)
        {
            if (CheckValidatedRiot(linked))
            {
                linked.validated = true;
            }
        }

        //Confirma se a conta está validada ou não
        public bool CheckValidatedRiot(LinkedAccount linked)
        {
            if (linked.profileIconID.Equals("7"))
            {
                return true;
            }
            return false;
        }

        //Desvincula a conta RIOT vinculada de um user
        public User UnlinkRiot(int userID)
        {
            User userTemp = GetById(userID);

            if (userTemp == null)
            {
                throw new AppException("Riot account not found");
            }

            userTemp.ContaRiot = null;

            return userTemp;     
        }


        //Retorna todos os utilizadores registados 
        public IEnumerable<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public User GetById(int id)
        {
            return _context.Users.Find(id);
        }

        //Atualiza as informações de um utilizador apartir de determinado ID
        public void Update(User userParam, string password = null)
        {
            var user = _context.Users.Find(userParam.UserID);

            if (user == null)
                throw new AppException("User not found");

            if (userParam.Nickname != user.Nickname)
            {
                // username has changed so check if the new username is already taken
                if (_context.Users.Any(x => x.Nickname == userParam.Nickname))
                    throw new AppException("Username " + userParam.Nickname + " is already taken");
            }

            user.Email = userParam.Email;
            user.Nickname = userParam.Nickname;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
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

            if (_context.Users.Any(x => x.Nickname == user.Nickname))
                throw new AppException("Username \"" + user.Nickname + "\" is already taken");

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.Users.Add(user);
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

        public static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
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

        public User Authenticate(string username, string password){
            if(String.IsNullOrWhiteSpace(username) || String.IsNullOrWhiteSpace(password)){
                return null;
            }

            var user = _context.Users.SingleOrDefault(x => x.Nickname == username);
            if(user != null){
                if(VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)){
                    return user;
                }
            } 
            
            return null;
        }

    }
}
