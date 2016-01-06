using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Admin.Controllers
{
    public class StaticContentController : Controller
    {
        #region Public Methods

        public static string GetMimeType(string extension)
        {
            if (extension == null)
            {
                throw new ArgumentNullException("extension");
            }

            if (!extension.StartsWith("."))
            {
                extension = "." + extension;
            }

            string mime;

            return _mappings.TryGetValue(extension, out mime) ? mime : "application/octet-stream";
        }

        [Route("/k/{*path}")]
        public IActionResult Content(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                path = "index.html";
            }

            var data = MapPathToResource(path);

            if (data == null) { return new HttpNotFoundResult(); }

            return new FileStreamResult(new MemoryStream(data), GetMimeType(path.Split('.').Last()));
        }

        #endregion

        #region Private Fields

        private static IDictionary<string, string> _mappings = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase) {
            {".js", "application/x-javascript"},
            {".html", "text/html"},
            {".txt", "text/plain"},
            {".css", "text/css"},
            {".ico", "image/x-icon"},
            {".eot", "application/octet-stream"},
            {".ttf", "application/octet-stream"},
        };

        #endregion

        #region Private Methods

        static byte[] MapPathToResource(string path)
        {
            var assembly = typeof(StaticContentController).Assembly;
            const string Prefix = "Kasbah.Web.Admin.wwwroot.dist";
            var resources = assembly.GetManifestResourceNames();
            var resPath = $"{Prefix}.{path}".Replace("/", ".").Replace("font-awesome", "font_awesome");

            if (resources.Contains(resPath))
            {
                using (var stream = assembly.GetManifestResourceStream(resPath))
                {
                    var buffer = new byte[stream.Length];

                    stream.Read(buffer, 0, buffer.Length);

                    return buffer;
                }
            }

            return null;
        }

        #endregion
    }
}