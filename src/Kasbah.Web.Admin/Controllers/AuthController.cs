using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Kasbah.Identity.Models;
using Kasbah.Web.Admin.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Admin.Controllers
{
    public class AuthController : Controller
    {
        #region Public Constructors

        public AuthController(UserManager<KasbahUser> userManager, SignInManager<KasbahUser> signInManager, ILoggerFactory loggerFactory, TokenAuthOptions tokenAuthOptions)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _log = loggerFactory.CreateLogger<AuthController>();
            _tokenAuthOptions = tokenAuthOptions;

            EnsureAdmin().Wait();
        }

        #endregion

        #region Public Methods

        [Route("/api/auth/login"), HttpPost]
        public async Task<LoginResponse> Login([FromBody] LoginRequest request)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByIdAsync(request.UserName);
                if (user != null)
                {
                    var passwordOk = await _userManager.CheckPasswordAsync(user, request.Password);
                    if (passwordOk)
                    {
                        var token = GetToken(user, null);

                        return new LoginResponse { Token = token };
                    }
                    else
                    {
                        return new LoginResponse
                        {
                            ErrorCode = (int)LoginResponse.ErrorCodes.InvalidUserNameOrPassword,
                            ErrorMessage = "Invalid username or password"
                        };
                    }
                }
                else
                {
                    return new LoginResponse
                    {
                        ErrorCode = (int)LoginResponse.ErrorCodes.InvalidUserNameOrPassword,
                        ErrorMessage = "Invalid username or password"
                    };
                }
            }

            return new LoginResponse
            {
                ErrorCode = (int)LoginResponse.ErrorCodes.InvalidRequest,
                ErrorMessage = "Invalid request"
            };
        }

        [Route("/api/auth/logout")]
        public async Task<BaseApiResponse> Logout(string redirect = null)
        {
            await _signInManager.SignOutAsync();

            return new BaseApiResponse { };
        }

        [Route("/api/auth/status")]
        public object Status()
        {
            return new
            {
                User
            };
        }

        #endregion

        #region Private Fields

        readonly ILogger _log;
        readonly SignInManager<KasbahUser> _signInManager;
        readonly TokenAuthOptions _tokenAuthOptions;
        readonly UserManager<KasbahUser> _userManager;

        #endregion

        #region Private Methods

        async Task EnsureAdmin()
        {
            var admin = await _userManager.FindByNameAsync("admin");
            if (admin == null)
            {
                var result = await _userManager.CreateAsync(new KasbahUser
                {
                    UserName = "admin",
                    Email = "email@changeme.org"
                }, "$Passw0rd");

                if (!result.Succeeded)
                {
                    throw new Exception($"Failed to create admin user: {result.Errors.FirstOrDefault().Description}");
                }
            }
        }

        string GetToken(KasbahUser user, DateTime? expires)
        {
            // var handler = new JwtSecurityTokenHandler();

            // Here, you should create or look up an identity for the user which is being authenticated.
            // For now, just creating a simple generic identity.
            // var identity = new ClaimsIdentity(new GenericIdentity(user.UserName, "TokenAuth"), new[] { new Claim("EntityID", user.Id, ClaimValueTypes.String) });

            // var securityToken = handler.CreateToken(
                // issuer: _tokenAuthOptions.Issuer,
                // audience: _tokenAuthOptions.Audience,
                // signingCredentials: _tokenAuthOptions.SigningCredentials,
                // subject: identity,
                // expires: expires);

            // return handler.WriteToken(securityToken);
            return null;
        }

        #endregion
    }
}