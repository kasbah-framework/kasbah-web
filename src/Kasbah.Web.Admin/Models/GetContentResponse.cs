using System.Collections.Generic;
using Kasbah.Core.Models;
using Kasbah.Web.Services;

namespace Kasbah.Web.Admin.Models
{
    public class GetContentResponse : BaseApiResponse
    {
        #region Public Properties

        public object Values { get; set; }
        public ModelDefinition Model { get; set; }
        public Node Node { get; set; }

        #endregion
    }
}