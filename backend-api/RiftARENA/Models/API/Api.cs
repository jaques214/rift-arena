using System.IO;
using System.Net.Http;

namespace RiftARENA.Models.API
{
    public class Api
    {
        protected string key { get; set; }
        private string Region { get; set; }

        public Api(string region)
        {
            Region = region; 
            key = GetKey("./Models/API/key.txt");
        }

        public HttpResponseMessage GET(string URL)
        {
            using(HttpClient client = new HttpClient())
            {
                var result = client.GetAsync(URL);
                result.Wait();

                return result.Result;
            }
        }

        public string GetKey(string path)
        {
            StreamReader sr = new StreamReader(path);
            return sr.ReadToEnd();
        }

        public string GetURI(string path)
        {
            System.Console.WriteLine(Region);
            string temp =  "https://" + Region + ".api.riotgames.com/lol/" + path + "?api_key=" + key;
            System.Console.WriteLine(temp);
            return temp;
        }
    }
}
