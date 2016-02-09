using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Models;
using Kasbah.Core.Utils;
using Kasbah.Web.Models;
using Microsoft.AspNet.Html.Abstractions;
using Microsoft.AspNet.Mvc.ViewFeatures;
using Microsoft.Extensions.WebEncoders;

namespace Kasbah.Web
{
    public static class HtmlExtensions
    {
        public static async Task<IHtmlContent> ModulesAsync(this HtmlHelper htmlHelper, string section)
        {
            var contentBroker = htmlHelper.ViewContext.RouteData.Values["contentBroker"] as ContentBroker;
            var node = htmlHelper.ViewContext.RouteData.Values["node"] as Node;

            if (node == null)
            {
                // An attempt has been made to render modules on a page that is not managed
                // by the content tree, i.e., a custom controller/action
                return null;
            }

            var modulesRoot = contentBroker.GetChild(node.Id, "modules");
            if (modulesRoot != null)
            {
                var moduleRoot = contentBroker.GetChild(modulesRoot.Id, section);
                if (moduleRoot != null)
                {
                    var moduleNodes = contentBroker.GetChildren(moduleRoot.Id);
                    var ret = new List<IHtmlContent>();
                    foreach (var moduleNode in moduleNodes)
                    {
                        if (!moduleNode.ActiveVersion.HasValue)
                        {
                            continue;
                        }

                        var type = TypeUtil.TypeFromName(moduleNode.Type);
                        var module = contentBroker.GetNodeVersion(moduleNode.Id, moduleNode.ActiveVersion.Value, type);
                        var moduleView = (module as ContentBase).View;

                        ret.Add(await htmlHelper.PartialAsync(moduleView, module, null));
                    }

                    if (ret.Any())
                    {
                        return new StringHtmlContent(string.Join(Environment.NewLine, ret.Select(ContentToString)));
                    }
                }
                else
                {
                    // TODO: log this attempt to render modules that don't exist.
                }
            }
            else
            {
                // TODO: log this attempt to render modules that don't exist.
            }

            return new StringHtmlContent(string.Empty);
        }

        public static string ContentToString(IHtmlContent content)
        {
            if (content == null) { return null; }

            var writer = new System.IO.StringWriter();

            content.WriteTo(writer, new HtmlEncoder());

            return writer.ToString();
        }
    }
}