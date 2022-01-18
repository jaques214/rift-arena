using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;
using System;

namespace RiftArena.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        /// <summary>
        /// Método que permite fazer o upload de ficheiros para o projeto
        /// </summary>
        /// <returns>Nome do ficheiro que levou upload</returns>
        [HttpPost, DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = fileName;
                    Console.WriteLine(fullPath);
                    Console.WriteLine(dbPath);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
