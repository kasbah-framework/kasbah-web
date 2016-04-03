using Kasbah.Core.ContentBroker.Models;
using Kasbah.Web.Public;
using Kasbah.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web
{
    public static class UrlExtensions
    {
        #region Public Methods

        /// <summary>
        /// Builds a URL based on the specified <paramref name="node"/>.
        /// </summary>
        /// <param name="urlHelper">The URL helper.</param>
        /// <param name="node">The node identifier.</param>
        /// <returns>A relative URL for the specified node.</returns>
        public static string Node(this IUrlHelper urlHelper, Kasbah.Core.Models.Node node)
        {
            if (node == null) { return null; }

            var service = ServiceLocator.ApplicationServices.GetRequiredService<UrlService>();

            return service.GetUrl(node);
        }

        /// <summary>
        /// Builds a URL based on the specified <paramref name="item"/>.
        /// </summary>
        /// <param name="urlHelper">The URL helper.</param>
        /// <param name="item">The item.</param>
        /// <returns>A relative URL for the specified item.</returns>
        public static string Node(this IUrlHelper urlHelper, ItemBase item)
        {
            if (item == null) { return null; }

            return Node(urlHelper, item.Node);
        }

        #endregion
    }
}