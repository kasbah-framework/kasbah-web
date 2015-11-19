using System;

namespace Kasbah.Web.Annotations
{
    public class EditorAttribute : Attribute
    {
        #region Public Constructors

        public EditorAttribute(string editor)
        {
            Editor = editor;
        }

        #endregion

        #region Public Properties

        public string Editor { get; set; }

        #endregion
    }
}