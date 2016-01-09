using System.Collections.Generic;
using Kasbah.Web.Annotations;

namespace Kasbah.Web.Models
{
    [Editor("link")]
    public class Link
    {
        public string DisplayText { get; set; }

        public string Url { get; set; }

        public string Target { get; set; }
    }

    [Editor("linkList")]
    public class LinkList : List<Link> { }
}