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
}