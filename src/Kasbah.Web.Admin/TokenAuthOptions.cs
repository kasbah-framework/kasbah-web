// using Microsoft.IdentityModel.Tokens;

namespace Kasbah.Web.Admin
{
    public class TokenAuthOptions
    {
        public string Audience { get; set; }
        public string Issuer { get; set; }
        // public SigningCredentials SigningCredentials { get; set; }
    }
}