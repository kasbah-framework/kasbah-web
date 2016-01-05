using System.Collections.Generic;

namespace Kasbah.Web.Admin.Models
{
    public class GetTypesResponse : BaseApiResponse
    {
        public IEnumerable<TypeInfo> Types { get; set; }
    }

    public class TypeInfo
    {
        public string Id { get; set; }

        public string DisplayName { get; set; }
    }
}