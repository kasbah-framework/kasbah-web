using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Kasbah.Core.ContentBroker;
using Kasbah.Core.Models;
using Kasbah.Core.Utils;
using Kasbah.Web.Models;
using Kasbah.Web.Public;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

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

            content.WriteTo(writer, HtmlEncoder.Default);

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
            var kasbahWebContext = htmlHelper.ViewContext.RouteData.Values["kasbahWebContext"] as KasbahWebContext;

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

                        if (module.GetType().GetTypeInfo().IsSubclassOf(typeof(VersionedContentContainer<>)))
                        {
                            module = module.GetType().GetMethod("SelectVersion").Invoke(module, new [] { kasbahWebContext }) as ContentBase;
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