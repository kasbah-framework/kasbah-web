namespace Kasbah.Web.Annotations
{
    public class DisplayNameAttribute : System.ComponentModel.DisplayNameAttribute
    {
        #region Public Constructors

        public DisplayNameAttribute(string displayName, string helpText = null)
            : base(displayName)
        {
            HelpText = helpText;
        }

        #endregion

        #region Public Properties

        public string HelpText { get; private set; }

        #endregion
    }
}