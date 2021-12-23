using RiftArena.Models;
using RiftArena.Models.Contexts;
using System.Collections.Generic;
using System.Linq;

namespace RiftARENA.Models.Services
{
    public interface IlinkedAccountService
    {
        IEnumerable<LinkedAccount> GetAll();
        LinkedAccount GetById(int id);
        LinkedAccount Create(LinkedAccount account);
        void Update(LinkedAccount account);
        void Delete(int id);
    }
    public class linkedAccountService : IlinkedAccountService
    {
        private RiftArenaContext _context;


        public linkedAccountService(RiftArenaContext context)
        {
            _context = context;
        }

        public LinkedAccount Create(LinkedAccount account)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(int id)
        {
            var account = GetById(id);
            if (account != null)
            {
                _context.LinkedAccounts.Remove(account);
                _context.SaveChanges();
            }
        }

        public IEnumerable<LinkedAccount> GetAll()
        {
            return _context.LinkedAccounts.ToList();
        }

        public LinkedAccount GetById(int id)
        {
            return _context.LinkedAccounts.Find(id);
        }

        public void Update(LinkedAccount account)
        {
            throw new System.NotImplementedException();
        }
    }
}
