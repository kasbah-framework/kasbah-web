using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Models;
using Kasbah.Core.Utils;
using Kasbah.Web.Models;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Routing;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Public
{
    public class KasbahRouter : IRouter
    {
        #region Public Constructors

        public KasbahRouter(IRouter next, ILoggerFactory loggerFactory, IApplicationContext applicationContext, ContentBroker contentBroker)
        {
            _next = next;

            _logger = loggerFactory.CreateLogger<KasbahRouter>();

            _applicationContext = applicationContext;

            _contentBroker = contentBroker;
        }

        #endregion

        #region Public Methods

        public VirtualPathData GetVirtualPath(VirtualPathContext context)
        {
            return _next.GetVirtualPath(context);
        }

        public async Task RouteAsync(RouteContext context)
        {
            var oldRouteData = context.RouteData;
            var newRouteData = new RouteData(oldRouteData);

            newRouteData.Routers.Add(_next);

            newRouteData.Values["contentBroker"] = _contentBroker;
            newRouteData.Values["applicationContext"] = _applicationContext;

            try
            {
                _logger.LogDebug($"Trying to match {context.HttpContext.Request.Host}");
                var site = GetSiteByRequest(context.HttpContext);
                if (site != null)
                {
                    _logger.LogDebug($"Site matched: {site.Alias}");
                    newRouteData.Values["site"] = site;

                    var node = GetNodeByPath(site, context.HttpContext.Request.Path);
                    if (node != null)
                    {
                        _logger.LogDebug($"Node matched: {node.Id}");
                        newRouteData.Values["controller"] = "DefaultContent";
                        newRouteData.Values["action"] = "RenderContent";

                        var content = GetContentByNode(node);
                        if (content != null)
                        {
                            _logger.LogDebug("Content found");

                            if (typeof(VersionedContentBase).IsAssignableFrom(content.GetType()))
                            {
                                var versionedContent = content as VersionedContentBase;

                                content = versionedContent.SelectVersion(context);
                            }

                            if (!string.IsNullOrEmpty(content.Controller) && !string.IsNullOrEmpty(content.Action))
                            {
                                if (content.Controller.Contains("."))
                                {
                                    var parts = content.Controller.Split('.');
                                    var controller = parts.Last();
                                    var ns = string.Join(".", parts.Take(parts.Count() - 1));

                                    newRouteData.Values["controller"] = controller;
                                    newRouteData.Values["namespace"] = ns;
                                }
                                else
                                {
                                    newRouteData.Values["controller"] = content.Controller;
                                }
                                newRouteData.Values["action"] = content.Action;
                            }

                            newRouteData.Values["view"] = content.View;
                        }

                        newRouteData.Values["content"] = content;
                        newRouteData.Values["node"] = node;

                        _logger.LogDebug($"Routing to: ({newRouteData.Values["namespace"]}.){newRouteData.Values["controller"]}.{newRouteData.Values["action"]} (view: {newRouteData.Values["view"]})");
                    }
                }

                context.RouteData = newRouteData;
                await _next.RouteAsync(context);
            }
            finally
            {
                if (!context.IsHandled)
                {
                    context.RouteData = oldRouteData;
                }
            }
        }

        #endregion

        #region Private Fields

        readonly IApplicationContext _applicationContext;
        readonly ContentBroker _contentBroker;
        readonly ILogger _logger;
        readonly IRouter _next;

        #endregion

        #region Private Methods

        ContentBase GetContentByNode(Node node)
        {
            if (node.ActiveVersion.HasValue)
            {
                return _contentBroker.GetNodeVersion(node.Id, node.ActiveVersion.Value, TypeUtil.TypeFromName(node.Type)) as ContentBase;
            }
            return null;
        }

        Node GetNodeByPath(Site site, string path)
        {
            var kasbahPath = new[] {
                "sites",
                site.Alias,
                "home",
            }.Concat(path.Split('/').Where(ent => !string.IsNullOrEmpty(ent)));

            return _contentBroker.GetNodeByPath(kasbahPath);
        }

        Site GetSiteByRequest(HttpContext context)
        {
            return _applicationContext.Sites.FirstOrDefault(ent => ent.Domains.Any(dom => dom.Domain == context.Request.Host.ToString()));
        }

        #endregion
    }
}