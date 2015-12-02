using System;
using System.Linq;
using System.Threading.Tasks;
using Kasbah.Identity.Models;
using Kasbah.Web.Admin.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;

namespace Kasbah.Web.Admin.Controllers
{
    public class AuthController : Controller
    {
        #region Public Constructors

        public AuthController(UserManager<KasbahUser> userManager, SignInManager<KasbahUser> signInManager, ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _log = loggerFactory.CreateLogger<AuthController>();
        }

        #endregion

        #region Public Methods

        [Route("/api/auth/init")]
        public async Task Init()
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

        [Route("/api/auth/login"), HttpPost]
        public async Task<LoginResponse> Login([FromBody] LoginRequest request)
        {
            if (ModelState.IsValid)
            {
                // TODO: implement checking Method on request, maybe. or ditch it
                var result = await _signInManager.PasswordSignInAsync(request.UserName, request.Password, request.Persist, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    return new LoginResponse { };
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
        readonly UserManager<KasbahUser> _userManager;

        #endregion
    }
}