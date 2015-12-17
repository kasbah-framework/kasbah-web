using System.Linq;
using System.Threading.Tasks;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.ContentTree.Models;
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

            try
            {
                _logger.LogVerbose($"Request {context.HttpContext.Request.Method} {context.HttpContext.Request.Path}");

                var site = GetSiteByRequest(context.HttpContext);
                if (site != null)
                {
                    _logger.LogDebug($"Site matched: {site.Alias}");
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
                            if (content.Controller != null && content.Action != null)
                            {
                                newRouteData.Values["controller"] = content.Controller;
                                newRouteData.Values["action"] = content.Action;
                            }

                            newRouteData.Values["view"] = content.View;
                        }

                        newRouteData.Values["content"] = content;
                        newRouteData.Values["node"] = node;

                        _logger.LogVerbose($"Routing to: {newRouteData.Values["controller"]}.{newRouteData.Values["action"]}");
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
                return _contentBroker.GetNodeVersion(node.Id, node.ActiveVersion.Value, node.Type) as ContentBase;
            }
            return null;
        }

        Node GetNodeByPath(Site site, string path)
        {
            var kasbahPath = new[] {
                "sites",
                site.Alias,
                // "content",
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