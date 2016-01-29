using System;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.ContentBroker.Models;
using Kasbah.Web.Models;
using Microsoft.AspNet.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWeb(this IApplicationBuilder app)
        {
            var contentBroker = app.ApplicationServices.GetRequiredService<ContentBroker>();
            var applicationContext = app.ApplicationServices.GetRequiredService<IApplicationContext>();

            var sitesRootNode = contentBroker.GetOrCreate<EmptyItem>(null, "sites");
            var actualSites = new SiteList();
            foreach (var site in applicationContext.Sites)
            {
                var siteNodeId = contentBroker.GetOrCreate<Site>(sitesRootNode, site.Alias);
                var siteNode = contentBroker.GetNode(siteNodeId);
                Guid versionId;

                if (!siteNode.ActiveVersion.HasValue)
                {
                    versionId = contentBroker.Save(siteNodeId, Guid.NewGuid(), site).Id;
                }
                else
                {
                    versionId = siteNode.ActiveVersion.Value;
                }

                actualSites.Add(contentBroker.GetNodeVersion<Site>(siteNodeId, versionId));

                site.EnsureStaticStructure(siteNodeId, contentBroker);
            }

            applicationContext.Sites = actualSites;

            return app;
        }

        #endregion
    }
}