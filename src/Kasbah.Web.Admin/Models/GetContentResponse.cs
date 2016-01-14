using System.Collections.Generic;

namespace Kasbah.Web.Admin.Models
{
    public class GetContentResponse : BaseApiResponse
    {
        #region Public Properties

        public ModelDefinition ModelDefinition { get; set; }

        public object Data { get; set; }

        #endregion
    }

    public class FieldDef
    {
        #region Public Properties

        public string Alias { get; set; }

        public string DisplayName { get; set; }

        public string HelpText { get; set; }

        public string Section { get; set; }

        public string Type { get; set; }

        #endregion
    }

    public class ModelDefinition
    {
        #region Public Properties

        public IEnumerable<FieldDef> Fields { get; set; }

        public IEnumerable<string> Sections { get; set; }

        #endregion
    }
}