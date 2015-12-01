using System;
using Kasbah.Core.ContentTree;
using Kasbah.Core.ContentTree.Models;
using Kasbah.Core.Events;
using Kasbah.Core.Utils;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Public.Controllers
{
    public class ContentController : Controller
    {
        #region Public Constructors

        public ContentController(ContentTreeService contentTreeService, IEventService eventService, ILoggerFactory loggerFactory)
        {
            _contentTreeService = contentTreeService;
            _eventService = eventService;
            // _log = loggerFactory.CreateLogger<ContentController>();
        }

        #endregion

        #region Public Methods

        [Route("api/content-for/{id}")]
        public object ContentFor(Guid id)
        {
            var node = _contentTreeService.GetNode(id);
            if (node.ActiveVersion.HasValue)
            {
                // var type = TypeUtil.TypeFromName(node.Type);
                // TODO: make the below call use `type`.

                var version = _contentTreeService.GetNodeVersion(node.Id, node.ActiveVersion.Value);

                _eventService.Emit(new WebPageView { /* ... */ });

                return version;
            }

            return HttpNotFound();
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

        #endregion

        #region Private Fields

        readonly ContentTreeService _contentTreeService;
        readonly IEventService _eventService;
        // readonly ILogger _log;

        #endregion

        #region Private Methods

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

        #endregion
    }

    class WebPageView : EventBase
    {
        #region Public Properties

        public Guid Node { get; set; }

        public Guid Version { get; set; }

        public DateTime Viewed { get; set; }

        #endregion

        // etc...
    }
}
