using Kasbah.Core.Models;
using Kasbah.Web.Annotations;
using Kasbah.Core.Annotations;

namespace Kasbah.Web.Models
{
    public abstract class ContentBase : ItemBase
    {
        #region Public Properties

        [Editor("text")]
        public virtual string Action { get; set; }
        [Editor("text")]
        public virtual string Controller { get; set; }
        [Editor("text")]
        public virtual string View { get; set; }

        [SystemField]
        public string Url { get; set; }

        #endregion
    }
}
