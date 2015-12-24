using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Public.Controllers
{
    public class DefaultContentController : Controller
    {
        #region Public Methods

        public ActionResult RenderContent()
        {
            var content = ViewData["content"];
            return View(content);
        }

        #endregion
    }
}