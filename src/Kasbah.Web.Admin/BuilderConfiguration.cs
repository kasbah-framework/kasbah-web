using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
// using Microsoft.IdentityModel.Tokens;

namespace Kasbah.Web.Admin
{
    public static class BuilderConfiguration
    {
        #region Public Methods

        public static IApplicationBuilder UseKasbahWebAdmin(this IApplicationBuilder app)
        {
            app.UseCors("defaultCorsPolicy");

            app.UseMvc();

            app.UseKasbahWeb();

            app.UseIdentity();

            // var tokenAuthOptions = app.ApplicationServices.GetRequiredService<TokenAuthOptions>();
            // app.UseJwtBearerAuthentication(new JwtBearerOptions
            // {
            //     TokenValidationParameters = new TokenValidationParameters
            //     {
            //         IssuerSigningKey = tokenAuthOptions.SigningCredentials.Key,
            //         ValidAudience = tokenAuthOptions.Audience,
            //         ValidIssuer = tokenAuthOptions.Issuer,
            //         //ValidateSignature = true,
            //         ValidateLifetime = true,
            //         ClockSkew = TimeSpan.Zero
            //     }
            // });

            return app;
        }

        #endregion
    }
}