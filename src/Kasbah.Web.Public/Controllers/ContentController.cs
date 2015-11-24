using System;
using Kasbah.Core.ContentTree;
using Kasbah.Core.ContentTree.Models;
using Kasbah.Core.Events;
using Kasbah.Core.Utils;
using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Public.Controllers
{
    public class ContentController : Controller
    {
        readonly ContentTreeService _contentTreeService;
        readonly IEventService _eventService;

        public ContentController(ContentTreeService contentTreeService, IEventService eventService)
        {
            _contentTreeService = contentTreeService;
            _eventService = eventService;
        }

        [Route("api/node-at")]
        public Node NodeAtPath(string path = null)
        {
            var siteRoot = GetSiteNode(Request.Host.Value);

            if (siteRoot == null)
            {
                return null;
            }

            var ret = _contentTreeService.GetChild(siteRoot.Id, "home");
            if (path != null && ret != null)
            {
                var parts = path.Split('/');
                foreach (var part in parts)
                {
                    ret = _contentTreeService.GetChild(ret.Id, part);
                }
            }

            return ret;
        }

        [Route("api/content-for/{id}")]
        public object ContentFor(Guid id)
        {
            var node = _contentTreeService.GetNode(id);
            if (node.ActiveVersion.HasValue)
            {
                var type = TypeUtil.TypeFromName(node.Type);

                var version = _contentTreeService.GetNodeVersion(node.Id, node.ActiveVersion.Value, type);

                _eventService.Emit<WebPageView>(new WebPageView { /* ... */ });

                return version;
            }

            return HttpNotFound();
        }

        Node GetSiteNode(string host)
        {
            var sitesNode = _contentTreeService.GetChild(null, "sites");

            var ret = _contentTreeService.GetChild(sitesNode.Id, host);

            if (ret == null)
            {
                ret = _contentTreeService.GetChild(sitesNode.Id, "default");
            }

            return ret;
        }

        string NormaliseHost(string input)
        {
            return input.ToLower();
        }
    }

    class WebPageView : EventBase
    {
        public Guid Node { get; set; }

        public Guid Version { get; set; }

        public DateTime Viewed { get; set; }

        // etc...
    }
}
