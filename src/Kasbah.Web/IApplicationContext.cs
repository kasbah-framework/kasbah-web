using System.Collections.Generic;
using Kasbah.Web.Models;

namespace Kasbah.Web
{
    public interface IApplicationContext
    {
        #region Public Properties

        IEnumerable<string> AdditionalModules { get; set; }
        ModelList ModelList { get; }

        SiteList Sites { get; set; }

        #endregion
    }
}