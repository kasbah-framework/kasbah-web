using Kasbah.Core.ContentBroker.Models;
using Kasbah.Web.Annotations;

namespace Kasbah.Web.Models
{
    [Icon("gears")]
    public abstract class ModuleBase : ItemBase
    {
        #region Public Properties

        [Editor("text", 2), Section("Output", int.MaxValue)]
        public virtual string View { get; set; }

        [Editor("text", 0), Section("Output", int.MaxValue)]
        public virtual string ViewComponent { get; set; }

        #endregion
    }
}