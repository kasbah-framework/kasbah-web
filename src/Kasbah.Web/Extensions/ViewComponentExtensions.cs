using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Extensions
{
    public static class ViewComponentExtensions
    {
        #region Public Methods

        public static KasbahWebContext GetKasbahWebContext(this ViewComponent viewComponent)
            => viewComponent.RouteData.Values["kasbahWebContext"] as KasbahWebContext;

        #endregion
    }
}