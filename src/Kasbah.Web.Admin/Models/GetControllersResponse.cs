using System.Collections.Generic;

namespace Kasbah.Web.Admin.Models
{
    public class GetControllersResponse : BaseApiResponse
    {
        public IEnumerable<ControllerInfo> Controllers { get; set; }
    }

    public class ControllerInfo
    {
        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public IEnumerable<string> Actions { get; set; }
    }
}