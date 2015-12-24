using System;
using Kasbah.Core;
using Kasbah.Core.ContentTree.Models;
using Kasbah.Core.Events;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Utils;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Public.Controllers
{
    public class ContentController : Controller
    {
        #region Public Constructors

        public ContentController(ContentBroker contentBroker, ILoggerFactory loggerFactory)
        {
            _contentBroker = contentBroker;
            _log = loggerFactory.CreateLogger<ContentController>();
        }

        #endregion

        #region Public Methods

        [Route("api/content-for/{id}")]
        public object ContentFor(Guid id)
        {
            var node = _contentBroker.GetNode(id);
            if (node.ActiveVersion.HasValue)
            {
                // TODO: find out why below call doesn't work when using `type`.

                var type = TypeUtil.TypeFromName(node.Type);

                var version = _contentBroker.GetNodeVersion(node.Id, node.ActiveVersion.Value, type);

                // _eventService.Emit(new WebPageView { /* ... */ });

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

            var ret = _contentBroker.GetChild(siteRoot.Id, "home");
            if (path != null && ret != null)
            {
                var parts = path.Split('/');
                foreach (var part in parts)
                {
                    ret = _contentBroker.GetChild(ret.Id, part);
                }
            }

            return ret;
        }

        #endregion

        #region Private Fields

        readonly ContentBroker _contentBroker;
        readonly ILogger _log;

        #endregion

        #region Private Methods

        Node GetSiteNode(string host)
        {
            var sitesNode = _contentBroker.GetChild(null, "sites");

            var ret = _contentBroker.GetChild(sitesNode.Id, host);

            if (ret == null)
            {
                ret = _contentBroker.GetChild(sitesNode.Id, "default");
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
