using System;
using System.Threading.Tasks;
using Kasbah.Identity.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

namespace Kasbah.Web.Admin.Controllers
{
    public class AuthController : Controller
    {

        readonly UserManager<KasbahUser> _userManager;

        readonly SignInManager<KasbahUser> _signInManager;

        public AuthController(UserManager<KasbahUser> userManager, SignInManager<KasbahUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [Route("/api/auth/get-token"), HttpPost]
        public async Task<GetTokenResponse> GetToken(GetTokenRequest request)
        {
            if (ModelState.IsValid)
            {
                var result = default(SignInResult);
                switch (request.Method)
                {
                    case "password":
                        result = await _signInManager.PasswordSignInAsync(request.UserName, request.Password, request.RememberMe, lockoutOnFailure: false);
                        break;
                    default:
                        throw new Exception();

                }
                if (result.Succeeded)
                {
                    return new GetTokenResponse { };
                }
                else
                {
                    return new GetTokenResponse
                    {
                        ErrorCode = (int)GetTokenResponse.ErrorCodes.InvalidUserNameOrPassword,
                        ErrorMessage = "Invalid username or password"
                    };
                }
            }

            return null;
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
    }

    public class GetTokenRequest
    {
        public string Method { get; set; } // TODO: change this to an enum

        public string UserName { get; set; }

        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }

    public class GetTokenResponse : BaseApiResponse
    {
        public enum ErrorCodes : int
        {
            InvalidUserNameOrPassword = 0x5001
        }

        public string RedirectUrl { get; set; }
    }

    public class BaseApiResponse
    {
        public bool Success { get { return !ErrorCode.HasValue; } }

        public string ErrorMessage { get; set; }

        public int? ErrorCode { get; set; }
    }
}