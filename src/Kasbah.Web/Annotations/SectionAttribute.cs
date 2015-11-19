using System;

namespace Kasbah.Web.Annotations
{
    public class SectionAttribute : Attribute
    {
        #region Public Constructors

        public SectionAttribute(string section)
        {
            Section = section;
        }

        #endregion

        #region Public Properties

        public string Section { get; set; }

        #endregion
    }
}