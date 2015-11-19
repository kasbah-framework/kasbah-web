using Microsoft.AspNet.Builder;

namespace Kasbah.Web.Admin
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebAdmin(this IApplicationBuilder app)
        {
            app.UseMvc();

            app.UseCors("default");

            return app;
        }

        #endregion
    }
}