using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Public.Controllers
{
    public class DefaultContentController : Controller
    {
        #region Public Methods

        public ActionResult RenderContent(object content)
        {
            return View(content);
        }

        #endregion
    }
}