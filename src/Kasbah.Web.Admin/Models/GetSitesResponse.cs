using System;
using System.Collections.Generic;

namespace Kasbah.Web.Admin.Models
{
    public class GetSitesResponse : BaseApiResponse
    {
        #region Public Properties

        public IEnumerable<SiteInfo> Sites { get; set; }

        #endregion
    }

    public class SiteInfo
    {
        #region Public Properties

        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public IEnumerable<string> Domains { get; set; }

        public Guid Id { get; set; }

        #endregion
    }
}