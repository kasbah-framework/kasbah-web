using System;
using System.Net;
using Kasbah.Core.ContentBroker.Models;
using Kasbah.Core.Models;
using Kasbah.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Kasbah.Web
{
    public class KasbahWebContext
    {
        #region Public Properties

        public IApplicationContext ApplicationContext { get; set; }
        public ItemBase Content { get; set; }
        public HostString CurrentHost { get; set; }
        public PathString CurrentPath { get; set; }
        public HttpContext HttpContext { get; set; }
        public Node Node { get; set; }
        public RouteContext RouteContext { get; set; }
        public Site Site { get; set; }
        public KasbahWebUserProfile UserProfile { get; set; }

        #endregion
    }

    public class KasbahWebUserProfile
    {
        #region Public Fields

        public static KasbahWebUserProfile Empty = new KasbahWebUserProfile { };

        #endregion

        #region Public Properties

        public DateTime FirstVisit { get; set; }
        public DateTime LastActive { get; set; }
        public string RemoteAddr { get; set; }

        #endregion
    }
}