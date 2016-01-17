using System;

namespace Kasbah.Web.Annotations
{
    public class EditorAttribute : Attribute
    {
        #region Public Constructors

        public EditorAttribute(string editor, int sortOrder = 0)
        {
            Editor = editor;
            SortOrder = sortOrder;
        }

        #endregion

        #region Public Properties

        public string Editor { get; set; }
        public int SortOrder { get; set; }

        #endregion
    }
}