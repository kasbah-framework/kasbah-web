using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Models;
using Kasbah.Core.Utils;
using Kasbah.Web.Models;
using Kasbah.Web.Public;
using Microsoft.AspNet.Html.Abstractions;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.AspNet.Mvc.ViewFeatures;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.WebEncoders;

namespace Kasbah.Web
{
    public static class HtmlExtensions
    {
        #region Private Fields

        static ILogger _log;

        #endregion

        #region Private Properties

        static ILogger Log
        {
            get { return (_log = (_log ?? ServiceLocator.ApplicationServices.GetRequiredService<ILoggerFactory>().CreateLogger(typeof(HtmlExtensions).FullName))); }
        }

        #endregion

        #region Private Methods

        static string ContentToString(IHtmlContent content)
        {
            if (content == null) { return null; }

            var writer = new System.IO.StringWriter();

            content.WriteTo(writer, new HtmlEncoder());

            return writer.ToString();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Renders all modules that belong to <paramref name="section"/>.
        /// </summary>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="section">The section to render.</param>
        /// <param name="viewComponentHelper">The view component helper.</param>
        /// <returns>The rendered HTML content from the matching modules.</returns>
        /// <exception cref="ArgumentNullException"></exception>
        public static async Task<IHtmlContent> ModulesAsync(this IHtmlHelper htmlHelper, string section, IViewComponentHelper viewComponentHelper = null)
        {
            var contentBroker = htmlHelper.ViewContext.RouteData.Values["contentBroker"] as ContentBroker;
            var node = htmlHelper.ViewContext.RouteData.Values["node"] as Node;

            if (node == null)
            {
                _log.LogWarning($"An attempt has been made to render modules on a page that is not managed by the content tree. View: '{htmlHelper.ViewContext.View.Path}' Section: {section}");

                return null;
            }

            var modulesRoot = contentBroker.GetChild(node.Id, "modules");
            if (modulesRoot != null)
            {
                var moduleRoot = contentBroker.GetChild(modulesRoot.Id, section);
                if (moduleRoot != null)
                {
                    var moduleNodes = contentBroker.GetChildren(moduleRoot.Id).OrderBy(ent => ent.Alias);
                    var ret = new List<IHtmlContent>();
                    foreach (var moduleNode in moduleNodes)
                    {
                        if (!moduleNode.ActiveVersion.HasValue)
                        {
                            continue;
                        }

                        var type = TypeUtil.TypeFromName(moduleNode.Type);
                        var module = contentBroker.GetNodeVersion(moduleNode.Id, moduleNode.ActiveVersion.Value, type);

                        if (typeof(VersionedContentBase).IsAssignableFrom(type.GetType()))
                        {
                            var versionedContent = module as VersionedContentBase;

                            module = versionedContent.SelectVersion(null);
                        }

                        if (module is ContentBase)
                        {
                            var moduleView = (module as ContentBase).View;

                            ret.Add(await htmlHelper.PartialAsync(moduleView, module, null));
                        }
                        else if (module is ModuleBase)
                        {
                            var moduleModule = (module as ModuleBase);
                            if (!string.IsNullOrEmpty(moduleModule.ViewComponent))
                            {
                                if (viewComponentHelper == null) { throw new ArgumentNullException(nameof(viewComponentHelper)); }

                                ret.Add(await viewComponentHelper.InvokeAsync(moduleModule.ViewComponent, module));
                            }
                            else
                            {
                                var moduleView = (module as ModuleBase).View;

                                ret.Add(await htmlHelper.PartialAsync(moduleView, module, null));
                            }
                        }
                    }

                    if (ret.Any())
                    {
                        return htmlHelper.Raw(string.Join(Environment.NewLine, ret.Select(ContentToString)));
                    }
                }
                else
                {
                    _log.LogWarning($"An attempt has been made to render modules where no modules exist for this section.  View: '{htmlHelper.ViewContext.View.Path}' Section: {section}");
                }
            }
            else
            {
                _log.LogWarning($"An attempt has been made to render modules where no modules exist.  View: '{htmlHelper.ViewContext.View.Path}' Section: {section}");
            }

            return new StringHtmlContent(string.Empty);
        }

        #endregion
    }
}