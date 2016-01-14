using Kasbah.Core.Models;
using Kasbah.Core.Annotations;
using Kasbah.Web.Annotations;

namespace Kasbah.Web.Models
{
    public abstract class ContentBase : ItemBase
    {
        #region Public Properties

        [Editor("text"), Section("Output", int.MaxValue)]
        public virtual string Action { get; set; }
        [Editor("text"), Section("Output", int.MaxValue)]
        public virtual string Controller { get; set; }
        [Editor("text"), Section("Output", int.MaxValue)]
        public virtual string View { get; set; }

        [SystemField]
        public string Url { get; set; }

        #endregion
    }
}
