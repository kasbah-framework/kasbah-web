namespace Kasbah.Web.Admin.Models
{
    public class LoginResponse : BaseApiResponse
    {
        #region Public Enums

        public enum ErrorCodes : int
        {
            InvalidUserNameOrPassword = 0x5001,
            InvalidRequest = 0x5002
        }

        #endregion

        #region Public Properties

        public string RedirectUrl { get; set; }

        public string Token { get; set; }

        #endregion
    }
}