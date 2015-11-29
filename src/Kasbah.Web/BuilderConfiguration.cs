using Kasbah.Core.ContentTree;
using Kasbah.Core.Models;
using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;

namespace Kasbah.Web
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWeb(this IApplicationBuilder app)
        {
            var contentTreeService = app.ApplicationServices.GetRequiredService<ContentTreeService>();
            var applicationContext = app.ApplicationServices.GetRequiredService<IApplicationContext>();

            var sitesRootNode = contentTreeService.GetOrCreate<EmptyItem>(null, "sites");
            foreach (var site in applicationContext.Sites)
            {
                var siteNode = contentTreeService.GetOrCreate<Site>(sitesRootNode, site.Alias);

                site.EnsureStaticStructure(siteNode, contentTreeService);
            }

            return app;
        }

        #endregion
    }
}