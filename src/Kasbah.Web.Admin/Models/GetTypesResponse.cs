using System.Collections.Generic;

namespace Kasbah.Web.Admin.Models
{
    public class GetTypesResponse : BaseApiResponse
    {
        #region Public Properties

        public IEnumerable<TypeInfo> Types { get; set; }

        #endregion
    }

    public class TypeInfo
    {
        #region Public Properties

        public string DisplayName { get; set; }
        public string Id { get; set; }

        #endregion
    }
}