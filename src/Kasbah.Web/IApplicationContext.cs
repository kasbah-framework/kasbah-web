using System.Collections.Generic;
using Kasbah.Web.Models;

namespace Kasbah.Web
{
    public interface IApplicationContext
    {
        #region Public Properties

        ModelList ModelList { get; }

        SiteList Sites { get; set; }

        IEnumerable<string> AdditionalModules { get; set; }

        #endregion
    }
}