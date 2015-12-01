using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web
{
    public static class Html5UrlModeExtension
    {
        #region Public Methods

        public static IApplicationBuilder UseHtml5UrlMode(this IApplicationBuilder builder, IHostingEnvironment hostingEnv, ILoggerFactory loggerFactory, string rootPath, string entryPath)
        {
            var options = new Html5UrlModeOptions()
            {
                FileServerOptions = new FileServerOptions()
                {
                    EnableDirectoryBrowsing = false
                },
                EntryPath = new PathString(entryPath)
            };

            builder.UseDefaultFiles(options.FileServerOptions.DefaultFilesOptions);

            return builder.Use(next => new Html5UrlModeMiddleware(next, hostingEnv, loggerFactory, options).Invoke);
        }

        #endregion
    }

    public class Html5UrlModeMiddleware
    {
        #region Public Constructors

        public Html5UrlModeMiddleware(RequestDelegate next, IHostingEnvironment hostingEnv, ILoggerFactory loggerFactory, Html5UrlModeOptions options)
        {
            _next = next;
            _options = options;

            _innerMiddleware = new StaticFileMiddleware(next, hostingEnv, options.FileServerOptions.StaticFileOptions, loggerFactory);
        }

        #endregion

        #region Public Methods

        public async Task Invoke(HttpContext context)
        {
            await _innerMiddleware.Invoke(context);

            if (context.Response.StatusCode == 404 && _options.Html5Mode)
            {
                context.Request.Path = _options.EntryPath;

                await _innerMiddleware.Invoke(context);
            }
        }

        #endregion

        #region Private Fields

        readonly StaticFileMiddleware _innerMiddleware;
        readonly RequestDelegate _next;
        readonly Html5UrlModeOptions _options;

        #endregion
    }

    public class Html5UrlModeOptions
    {
        #region Public Constructors

        public Html5UrlModeOptions()
        {
            FileServerOptions = new FileServerOptions();
            EntryPath = PathString.Empty;
        }

        #endregion

        #region Public Properties

        public PathString EntryPath { get; set; }
        public FileServerOptions FileServerOptions { get; set; }

        public bool Html5Mode
        {
            get
            {
                return EntryPath.HasValue;
            }
        }

        #endregion
    }
}
