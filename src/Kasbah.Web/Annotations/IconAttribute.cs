using System;

namespace Kasbah.Web.Annotations
{
    public class IconAttribute : Attribute
    {
        #region Public Constructors

        public IconAttribute(string icon, string colour = null)
        {
            Icon = icon;
            Colour = colour;
        }

        #endregion

        #region Public Properties

        public string Colour { get; set; }
        public string Icon { get; set; }

        #endregion
    }
}