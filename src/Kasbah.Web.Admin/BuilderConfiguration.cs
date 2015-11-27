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

            app.UseMvc();

            return app;
        }

        #endregion
    }
}