using Kasbah.Core.ContentBroker.Models;
using Kasbah.Web.Public;
using Kasbah.Web.Services;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web
{
    public static class UrlExtensions
    {
        #region Public Methods

        public static string Node(this IUrlHelper urlHelper, Kasbah.Core.Models.Node node)
        {
            if (node == null) { return null; }

            var service = ServiceLocator.ApplicationServices.GetRequiredService<UrlService>();

            return service.GetUrl(node);
        }

        public static string Node(this IUrlHelper urlHelper, ItemBase item)
        {
            if (item == null) { return null; }

            return Node(urlHelper, item.Node);
        }

        #endregion
    }
}