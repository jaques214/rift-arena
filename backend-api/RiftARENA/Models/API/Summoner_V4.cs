using Newtonsoft.Json;
using RiftArena.Models;
using System.Collections.Generic;

namespace RiftARENA.Models.API
{
    public class Summoner_V4 : Api
    {
        public Summoner_V4(string region) : base(region)
        {
        }

        public SummonerDTO GetSummonerByName(string SummonerName)
        {
            string path = "summoner/v4/summoners/by-name/" + SummonerName;

            var response = GET(GetURI(path));
            string content = response.Content.ReadAsStringAsync().Result;
            System.Console.WriteLine("content by name " + content);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {

                return JsonConvert.DeserializeObject<SummonerDTO>(content);
            }
            else
            {
                return null;
            }

        }

        public SummonerSTATS GetSummonerStatsById(string summonerId)
        {
            string path = "league/v4/entries/by-summoner/" + summonerId;

            var response = GET(GetURI(path));
            string content = response.Content.ReadAsStringAsync().Result;
            System.Console.WriteLine("content" + content);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var obj = JsonConvert.DeserializeObject<List<SummonerSTATS>>(content);
                return obj[0];
            }
            else
            {
                return null;
            }

        }
    }
}
