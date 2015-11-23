using Newtonsoft.Json;

namespace Kasbah.Web.Admin.Models
{

    public class LoginRequest
    {
        public string Method { get; set; } // TODO: change this to an enum or ditch it

        [JsonProperty("username")]
        public string UserName { get; set; }

        public string Password { get; set; }

        public bool Persist { get; set; }
    }

    public class LoginResponse : BaseApiResponse
    {
        public enum ErrorCodes : int
        {
            InvalidUserNameOrPassword = 0x5001,
            InvalidRequest = 0x5002
        }

        public string RedirectUrl { get; set; }

        public string Token { get; set; }
    }
}