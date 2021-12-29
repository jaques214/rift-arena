using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiftArena.Models;
using RiftArena.Models.Contexts;
using RiftArena.Models.API;
using System;
using System.Collections.Generic;
using System.Linq;

using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;


namespace RiftArena.Models.Services

{
    //Interface de UserService com os métodos e funções a implementar
    public interface IUserService
    {
        User Authenticate(string username, string password);
        String GenerateToken(byte[] key, User user);
        IEnumerable<User> GetAll();
        User GetByUsername(string nickname);
        User Create(User user, string password);
        void Update(User user, string password = null);
        void Delete(string username);
        User LinkRiot(string userID, string nickname, string region);
        void ValidateRiot(LinkedAccount linked);
        bool CheckValidatedRiot(LinkedAccount linked);
        User UnlinkRiot(string userID);
        List<Request> GetAllRequestsOfUserById(string userID);
        void UpdateRiotAccount(string nickname);

        Request CreateRequest(string nickname);

    }
    public class UserServices : IUserService
    {
        private RiftArenaContext _context;


        public UserServices(RiftArenaContext context)
        {
            _context = context;
        }

        //Retorna uma lista com os pedidos de um determinado User
        public List<Request> GetAllRequestsOfUserById(string userID)
        {
            User userTemp = GetByUsername(userID);

            if (userTemp == null)
            {
                throw new AppException("Account not found");
            }
            else
            {
                return userTemp.Requests;
            }
        }
        //Apartir do ID de uma linkedAccount vai buscar o rank da mesma apartir da API da RIOT
        public string GetSummonerRank(LinkedAccount account)
        {
            Summoner_V4 summoner_v4 = new Summoner_V4(account.Region);
            var summoner = summoner_v4.GetSummonerStatsById(account.ID);

            if (summoner == null)
            {
                throw new AppException("Not able to retrieve ingame stats");
            }

            Console.WriteLine("SUMMOMMER" + summoner);
            account.Rank = summoner.tier;


            return account.Rank;
        }

        //Verifica se o Summoner Existe na riot api
        public bool VerifySummoner(string region, string summonerName)
        {
            Summoner_V4 summoner_v4 = new Summoner_V4(region);

            var summoner = summoner_v4.GetSummonerByName(summonerName);

            return summoner != null;
        }

        //Conecta a conta riot retornando já o user atualizado e confirma a validação pelo Icon
        public User LinkRiot(string userID, string nickname, string region)
        {
            User userTemp = GetByUsername(userID);

            if (userTemp != null)
            {
                Summoner_V4 summoner_v4 = new Summoner_V4(region);
                var summoner = summoner_v4.GetSummonerByName(nickname);
                Console.WriteLine(summoner);

                if (summoner == null)
                {
                    throw new AppException("Riot account not found");
                }

                var linkedTemp = new LinkedAccount
                {
                    Username = nickname,
                    ProfileIconID = summoner.profileIconId,
                    Region = region,
                    ID = summoner.id,
                    SummonerLevel = summoner.summonerLevel,
                    Validated = false
                };

                linkedTemp.Rank = GetSummonerRank(linkedTemp);
                userTemp.LinkedAccount = linkedTemp;
                userTemp.ContaRiot = nickname;

                if (CheckValidatedRiot(linkedTemp))
                {
                    linkedTemp.Validated = true;
                }



            }
            else
            {
                throw new AppException("User not found");
            }
            return userTemp;
        }

        //Atualiza o rank e Level da conta Riot vinculada
        public void UpdateRiotAccount(string nickname)
        {
            User userTemp = GetByUsername(nickname);

            if (userTemp == null)
            {
                throw new AppException("User not found");
            }
            else
            {
                var linkedTemp = _context.LinkedAccounts.Find(userTemp.LinkedAccount.ID);
                if (linkedTemp == null)
                {
                    throw new AppException("No riot account linked to you.");
                }
                else
                {
                    Summoner_V4 summoner_v4 = new Summoner_V4(linkedTemp.Region);
                    var summoner = summoner_v4.GetSummonerByName(linkedTemp.Username);

                    linkedTemp.SummonerLevel = summoner.summonerLevel;
                    linkedTemp.ProfileIconID = summoner.profileIconId;
                    linkedTemp.Rank = GetSummonerRank(linkedTemp);
                    // _context.LinkedAccounts.Update(linkedTemp);
                }
            }

        }

        //Muda o estado da conta para validada
        public void ValidateRiot(LinkedAccount linked)
        {
            if (CheckValidatedRiot(linked))
            {
                linked.Validated = true;
            }
        }

        //Confirma se a conta está validada ou não
        public bool CheckValidatedRiot(LinkedAccount linked)
        {
            if (linked.ProfileIconID == 7)
            {
                return true;
            }
            return false;
        }

        //Desvincula a conta RIOT vinculada de um user
        public User UnlinkRiot(string userID)
        {
            User userTemp = GetByUsername(userID);

            if (userTemp == null)
            {
                throw new AppException("Riot account not found");
            }
            if(userTemp.TeamTag != null)
            {
                throw new AppException("Can't unlink your account. Exit your team first before unlinking your RIOT account.");
            }

            //if (_context.LinkedAccounts.Any(x => x.ID == userTemp.Name))
            LinkedAccount linkedTemp = _context.LinkedAccounts.Find(userTemp.LinkedAccount.ID);
            _context.LinkedAccounts.Remove(linkedTemp);
            _context.SaveChanges();
            userTemp.ContaRiot = null;


            return userTemp;
        }


        //Retorna todos os utilizadores registados 
        /// <summary>
        /// Método responsável por retornar todos os utilizadores guardados na base de dados.
        /// </summary>
        /// <returns>Uma lista de utilizadores guardados na base de dados.</returns>
        public IEnumerable<User> GetAll()
        {
            return _context.Users.ToList();
        }

        /// <summary>
        /// Método responsável por retornar um utilizador pesquisado pelo seu nickname.
        /// </summary>
        /// <param name="nickname">Nickname do utilizador a ser pesquisado.</param>
        /// <returns>Utilizador com o mesmo nickname.</returns>
        public User GetByUsername(string nickname)
        {
            return _context.Users.SingleOrDefault(x => x.Nickname == nickname);
        }

        /// <summary>
        /// Método responsável por modificar informações de um utilizador.
        /// </summary>
        /// <param name="userParam">Dados alterados do utilizador.</param>
        /// <param name="password">Password do utilizador.</param>
        public void Update(User userParam, string password = null)
        {
            var user = GetByUsername(userParam.Nickname);

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

        /// <summary>
        /// Método responsável por eliminar um utilizador.
        /// </summary>
        /// <param name="username">Nickname do utilizador a ser eliminado.</param>
        public void Delete(string username)
        {
            var user = GetByUsername(username);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        /// <summary>
        /// Método responsável por criar um utilizador.
        /// </summary>
        /// <param name="user">Dados do utilizador a criar.</param>
        /// <param name="password">Password do utilizador a criar.</param>
        /// <returns>Utilizador criado</returns>
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

        /// <summary>
        /// Método que permite autenticar um user.
        /// </summary>
        /// <param name="username">Nickname do utilizador</param>
        /// <param name="password">Password do utilizador.</param>
        /// <returns></returns>
        public User Authenticate(string username, string password)
        {
            if (String.IsNullOrWhiteSpace(username) || String.IsNullOrWhiteSpace(password))
            {
                return null;
            }

            var user = _context.Users.SingleOrDefault(x => x.Nickname == username);
            if (user != null)
            {
                if (VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                {
                    return user;
                }
            }

            return null;
        }


        /// <summary>
        /// Método para gerar o token de um utilizador logado.
        /// </summary>
        /// <param name="key">Chave para criação do token.</param>
        /// <param name="user">Utilizador autenticado.</param>
        /// <returns>Token do utilizador autenticado.</returns>
        public string GenerateToken(byte[] key, User user)
        {
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                    new Claim(ClaimTypes.Name, user.Nickname)
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescription);

            return tokenHandler.WriteToken(token);
        }



        //Cria um request de um team leader para um determinado user entrar na sua equipa
        public Request CreateRequest(string nickname)
        {

            var userTemp = GetByUsername(nickname);

            if (userTemp != null)
            {
                Request request = new Request
                {
                    User = userTemp,
                    Team = _context.Teams.SingleOrDefault(x => x.Tag == userTemp.TeamTag),
                    Accepted = false
                };

                userTemp.Requests.Add(request);

                _context.Requests.Add(request);
                _context.SaveChanges();
                return request;
            }
            else
            {
                throw new AppException("User not found or non-existent.");
            }

        }
    }
}



