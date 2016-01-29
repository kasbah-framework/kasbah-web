using System.Collections.Generic;

namespace Kasbah.Web.Admin.Models
{
    public class ControllerInfo
    {
        #region Public Properties

        public IEnumerable<string> Actions { get; set; }
        public string Alias { get; set; }

        public string DisplayName { get; set; }

        #endregion
    }

    public class GetControllersResponse : BaseApiResponse
    {
        #region Public Properties

        public IEnumerable<ControllerInfo> Controllers { get; set; }

        #endregion
    }
}