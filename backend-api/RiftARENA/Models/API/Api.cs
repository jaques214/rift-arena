using System.IO;
using System.Net.Http;

namespace RiftArena.Models.API;

public class Api
{
    private static readonly HttpClient Client = new();
    protected string key { get; set; }
    private string Region { get; set; }

    public Api(string region)
    {
        Region = region; 
        key = GetKey("./Models/API/key.txt");
    }

    public HttpResponseMessage GET(string URL)
    {
        var result = Client.GetAsync(URL);
        result.Wait();

        return result.Result;
    }

    public string GetKey(string path)
    {
        StreamReader sr = new StreamReader(path);
        return sr.ReadToEnd();
    }

    public string GetURI(string path)
    {
        string temp =  "https://" + Region + ".api.riotgames.com/lol/" + path + "?api_key=" + key;
        return temp;
    }
}