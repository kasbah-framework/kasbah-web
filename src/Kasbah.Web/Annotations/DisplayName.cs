using System;

namespace Kasbah.Web.Annotations
{
    public class DisplayNameAttribute : Attribute
    {
        #region Public Constructors

        public DisplayNameAttribute(string displayName, string helpText = null)
        {
            DisplayName = displayName;
            HelpText = helpText;
        }

        #endregion

        #region Public Properties

        public string DisplayName { get; set; }

        public string HelpText { get; private set; }

        #endregion
    }
}