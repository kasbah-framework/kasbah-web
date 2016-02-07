using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using Microsoft.IdentityModel.Tokens;
using Xunit;
using System.Security.Cryptography;

namespace DnxCore.Tests
{
    public class Jwt
    {
        public static RSAParameters GetRandomKey()
        {
            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                try
                {
                    return rsa.ExportParameters(true);
                }
                finally
                {
                    rsa.PersistKeyInCsp = false;
                }
            }
        }

        [Fact]
        public void TestJwtAuth()
        {
            var userName = "userName";
            var userId = Guid.NewGuid().ToString();

            var tokenAudience = "Myself";
            var tokenIssuer = "MyProject";
#if DNXCORE50
            var key = new RsaSecurityKey(new RSAOpenSsl(2048));
#else
            var key = new RsaSecurityKey(new RSACryptoServiceProvider(2048));
#endif
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.RSA_SHA512);

            var handler = new JwtSecurityTokenHandler();

            // Here, you should create or look up an identity for the user which is being authenticated.
            // For now, just creating a simple generic identity.
            var identity = new ClaimsIdentity(new GenericIdentity(userName, "TokenAuth"), new[] { new Claim("EntityID", userId, ClaimValueTypes.String) });

            var securityToken = handler.CreateToken(
                issuer: tokenIssuer,
                audience: tokenAudience,
                signingCredentials: signingCredentials,
                subject: identity,
                expires: DateTime.UtcNow.AddMinutes(15));

            var token = handler.WriteToken(securityToken);

            Assert.NotNull(token);

            Console.WriteLine(token);
        }
    }

    class MySecurityKey : SecurityKey
    {
        public override int KeySize
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override SignatureProvider GetSignatureProvider(string algorithm, bool verifyOnly)
        {
            throw new NotImplementedException();
        }
    }
}