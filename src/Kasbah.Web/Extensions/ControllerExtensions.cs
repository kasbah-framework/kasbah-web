using Microsoft.AspNetCore.Mvc;

namespace Kasbah.Web.Extensions
{
    public static class ControllerExtensions
    {
        #region Public Methods

        public static KasbahWebContext GetKasbahWebContext(this Controller controller)
            => controller.RouteData.Values["kasbahWebContext"] as KasbahWebContext;

        #endregion
    }
}