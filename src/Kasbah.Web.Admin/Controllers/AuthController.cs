using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Admin.Controllers
{
    public class StatusController
    {
        [Route("/status")]
        public string Status()
        {
            return "ok";
        }
    }
}