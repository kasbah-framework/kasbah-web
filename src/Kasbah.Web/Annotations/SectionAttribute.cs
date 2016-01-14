using System;

namespace Kasbah.Web.Annotations
{
    public class SectionAttribute : Attribute
    {
        #region Public Constructors

        public SectionAttribute(string section, int sortOrder = 0)
        {
            Section = section;
            SortOrder = sortOrder;
        }

        #endregion

        #region Public Properties

        public string Section { get; set; }
        public int SortOrder { get; set; }

        #endregion
    }
}