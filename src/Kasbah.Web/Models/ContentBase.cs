using Kasbah.Core.Annotations;
using Kasbah.Web.Annotations;
using Kasbah.Core.ContentBroker.Models;

namespace Kasbah.Web.Models
{
    public abstract class ContentBase : ItemBase
    {
        #region Public Properties

        [Editor("text", 1), Section("Output", int.MaxValue)]
        public virtual string Action { get; set; }
        [Editor("text", 0), Section("Output", int.MaxValue)]
        public virtual string Controller { get; set; }
        [Editor("text", 2), Section("Output", int.MaxValue)]
        public virtual string View { get; set; }

        [SystemField]
        public string Url { get; set; }

        #endregion
    }
}
