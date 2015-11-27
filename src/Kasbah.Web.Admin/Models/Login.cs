using Newtonsoft.Json;

namespace Kasbah.Web.Admin.Models
{
    public class LoginRequest
    {
        #region Public Properties

        public string Method { get; set; } // TODO: change this to an enum or ditch it

        public string Password { get; set; }

        public bool Persist { get; set; }

        [JsonProperty("username")]
        public string UserName { get; set; }

        #endregion
    }

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