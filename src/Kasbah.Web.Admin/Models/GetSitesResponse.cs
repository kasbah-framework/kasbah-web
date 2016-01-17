using System.Collections.Generic;

namespace Kasbah.Web.Admin.Models
{
    public class GetSitesResponse : BaseApiResponse
    {
        public IEnumerable<SiteInfo> Sites { get; set; }
    }

    public class SiteInfo
    {
        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public IEnumerable<string> Domains { get; set; }
    }
}