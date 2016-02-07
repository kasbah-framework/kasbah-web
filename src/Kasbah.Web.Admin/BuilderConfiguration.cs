using System;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNet.Authentication.JwtBearer;
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

            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = ServiceConfiguration.Key,
                    ValidAudience = ServiceConfiguration.TokenOptions.Audience,
                    ValidIssuer = ServiceConfiguration.TokenOptions.Issuer,
                    // ValidateSignature = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }
            });

            app.UseMvc();

            app.UseKasbahWeb();

            return app;
        }

        #endregion
    }
}