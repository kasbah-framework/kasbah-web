﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Kasbah.Web.Public
{
    // TODO: utilise this
    public class KasbahViewLocationExpander : IViewLocationExpander
    {
        #region Public Methods

        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            var ret = viewLocations.ToList();

            if (context.ActionContext is ViewContext)
            {
                var viewContext = context.ActionContext as ViewContext;
                if (viewContext.ExecutingFilePath?.EndsWith(".cshtml") ?? false)
                {
                    var currentPath = viewContext.ExecutingFilePath.Split('/');

                    ret.Add(string.Join("/", currentPath.Take(currentPath.Length - 1)) + "/{0}.cshtml");
                }
            }

            ret.Add("/Views/{0}/{1}.cshtml");
            ret.Add("/Views/{0}.cshtml");

            return ret;
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
        }

        #endregion
    }
}