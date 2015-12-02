using Microsoft.AspNet.Builder;

namespace Kasbah.Web.Admin
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebAdmin(this IApplicationBuilder app)
        {
            app.UseCors("allowAnyOrigin");

            app.UseIdentity();
            app.UseCookieAuthentication();

            app.UseMvc();

            app.UseKasbahWeb();

            return app;
        }

        #endregion
    }
}