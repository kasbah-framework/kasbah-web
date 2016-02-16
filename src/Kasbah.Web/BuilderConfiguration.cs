using System;
using System.Collections.Generic;
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
            var siteNodeMap = new Dictionary<Guid, Site>();
            foreach (var site in applicationContext.Sites)
            {
                var siteNodeId = contentBroker.GetOrCreate<Site>(sitesRootNode, site.Alias);
                var siteNode = contentBroker.GetNode(siteNodeId);
                var versionId = siteNode.ActiveVersion.HasValue ? siteNode.ActiveVersion.Value
                    : contentBroker.Save(siteNodeId, Guid.NewGuid(), site).Id;

                siteNodeMap.Add(siteNodeId, site);

                site.EnsureStaticStructure(siteNodeId, contentBroker);
            }

            applicationContext.SiteNodeMap = siteNodeMap;

            return app;
        }

        #endregion
    }
}