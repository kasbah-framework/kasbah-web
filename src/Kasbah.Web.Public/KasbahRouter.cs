using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.ContentBroker.Models;
using Kasbah.Core.Models;
using Kasbah.Core.Utils;
using Kasbah.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Public
{
    public class KasbahRouter : IKasbahRouter
    {
        #region Public Constructors

        public KasbahRouter(IRouter next, ILoggerFactory loggerFactory, IApplicationContext applicationContext, ContentBroker contentBroker, IKasbahWebUserProfiler userProfiler)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<KasbahRouter>();
            _applicationContext = applicationContext;
            _contentBroker = contentBroker;
            _userProfiler = userProfiler;
        }

        #endregion

        #region Public Methods

        public VirtualPathData GetVirtualPath(VirtualPathContext context)
        {
            return _next.GetVirtualPath(context);
        }

        public async Task RouteAsync(RouteContext context)
        {
            var kasbahWebContext = GetKasbahWebContext(context);

            var oldRouteData = context.RouteData;
            var newRouteData = new RouteData(oldRouteData);

            newRouteData.Routers.Add(_next);

            newRouteData.Values["contentBroker"] = _contentBroker;
            newRouteData.Values["applicationContext"] = _applicationContext;
            newRouteData.Values["kasbahWebContext"] = kasbahWebContext;

            try
            {
                _logger.LogDebug($"Trying to match {context.HttpContext.Request.Host}.  Available sites: {string.Join(", ", _applicationContext.Sites.SelectMany(s => s.Domains).SelectMany(d => d.Domain))}");
                var site = GetSiteByRequest(context.HttpContext);
                if (site != null)
                {
                    newRouteData.Values["site"] = site;
                    kasbahWebContext.Site = site;

                    var node = GetNodeByPath(site, context.HttpContext.Request.Path);
                    if (node != null)
                    {
                        newRouteData.Values["node"] = node;
                        kasbahWebContext.Node = node;

                        newRouteData.Values["controller"] = "DefaultContent";
                        newRouteData.Values["action"] = "RenderContent";

                        var content = GetContentByNode(node);
                        if (content != null)
                        {
                            newRouteData.Values["content"] = content;
                            kasbahWebContext.Content = content;

                            if (content.GetType().GetTypeInfo().IsSubclassOf(typeof(VersionedContentContainer<>)))
                            {
                                content = content.GetType().GetMethod("SelectVersion").Invoke(content, new [] { kasbahWebContext }) as ContentBase;
                            }

                            if (content != null && content.GetType().GetTypeInfo().IsSubclassOf(typeof(ContentBase)))
                            {
                                var webContent = content as ContentBase;
                                if (!string.IsNullOrEmpty(webContent.Controller) && !string.IsNullOrEmpty(webContent.Action))
                                {
                                    if (webContent.Controller.Contains("."))
                                    {
                                        var parts = webContent.Controller.Split('.');
                                        var controller = parts.Last();
                                        var ns = string.Join(".", parts.Take(parts.Count() - 1));

                                        newRouteData.Values["controller"] = controller;
                                        newRouteData.Values["namespace"] = ns;
                                    }
                                    else
                                    {
                                        newRouteData.Values["controller"] = webContent.Controller;
                                    }
                                    newRouteData.Values["action"] = webContent.Action;
                                }

                                newRouteData.Values["view"] = webContent.View;

                                _logger.LogDebug($"Routing to: ({newRouteData.Values["namespace"]}.){newRouteData.Values["controller"]}.{newRouteData.Values["action"]} (view: {newRouteData.Values["view"]})");

                                context.RouteData = newRouteData;
                            }
                        }
                    }
                }
                await _next.RouteAsync(context);

                // Profile the user after everything has happened
                _userProfiler?.ProfileUser(kasbahWebContext);
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred processing a request: {ex.Message}", ex);
            }
            finally
            {
                // if (!context.IsHandled)
                // {
                //     context.RouteData = oldRouteData;
                // }
            }
        }

        #endregion

        #region Private Fields

        readonly IApplicationContext _applicationContext;
        readonly ContentBroker _contentBroker;
        readonly ILogger _logger;
        readonly IRouter _next;
        readonly IKasbahWebUserProfiler _userProfiler;

        #endregion

        #region Private Methods

        ItemBase GetContentByNode(Node node)
        {
            if (node.ActiveVersion.HasValue)
            {
                return _contentBroker.GetNodeVersion(node.Id, node.ActiveVersion.Value, TypeUtil.TypeFromName(node.Type)) as ItemBase;
            }
            return null;
        }

        KasbahWebContext GetKasbahWebContext(RouteContext context)
        {
            var ret = new KasbahWebContext
            {
                ApplicationContext = _applicationContext,
                RouteContext = context,
                HttpContext = context.HttpContext,
                CurrentHost = context.HttpContext.Request.Host,
                CurrentPath = context.HttpContext.Request.Path
            };

            ret.UserProfile = _userProfiler?.GetProfile(ret) ?? KasbahWebUserProfile.Empty;

            return ret;
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