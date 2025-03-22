namespace Flagsmith.Core.Authentication;

public interface IAuthenticationProvider
{
    Task<bool> AuthenticateAsync(HttpContext context);
}