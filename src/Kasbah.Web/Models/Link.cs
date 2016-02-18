using System.Collections.Generic;
using Kasbah.Web.Annotations;

namespace Kasbah.Web.Models
{
    [Editor("link")]
    public class Link
    {
        #region Public Properties

        public string DisplayText { get; set; }

        public string Target { get; set; }
        public string Url { get; set; }

        #endregion
    }

    [Editor("linkList")]
    public class LinkList : List<Link> { }
}