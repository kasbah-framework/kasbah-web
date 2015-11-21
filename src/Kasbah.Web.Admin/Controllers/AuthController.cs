using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Admin.Controllers
{
    public class AuthController
    {
        [Route("/test")]
        public string Test()
        {
            return "Hello";
        }
    }
}