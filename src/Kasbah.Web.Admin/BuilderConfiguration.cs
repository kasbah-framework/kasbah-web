using System;
using System.IdentityModel.Tokens;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Kasbah.Web.Admin
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebAdmin(this IApplicationBuilder app)
        {
            app.UseCors("defaultCorsPolicy");

            // app.UseIdentity();

            // var tokenAuthOptions = app.ApplicationServices.GetRequiredService<TokenAuthOptions>();
            // app.UseJwtBearerAuthentication(new JwtBearerOptions
            // {
            //     TokenValidationParameters = new TokenValidationParameters
            //     {
            //         IssuerSigningKey = tokenAuthOptions.SigningCredentials.Key,
            //         ValidAudience = tokenAuthOptions.Audience,
            //         ValidIssuer = tokenAuthOptions.Issuer,
            //         ValidateSignature = true,
            //         ValidateLifetime = true,
            //         ClockSkew = TimeSpan.Zero
            //     }
            // });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseKasbahWeb();

            return app;
        }

        #endregion
    }
}