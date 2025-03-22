using System.Text;

namespace Flagsmith.Core.Authentication;

public class BasicAuthenticationProvider : IAuthenticationProvider
{
    private readonly string _username;
    private readonly string _password;

    public BasicAuthenticationProvider(string username, string password)
    {
        _username = username;
        _password = password;
    }

    public Task<bool> AuthenticateAsync(HttpContext context)
    {
        string authHeader = context.Request.Headers["Authorization"];
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
        {
            context.Response.Headers.Append("WWW-Authenticate", "Basic");
            return Task.FromResult(false);
        }

        string encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
        string credentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
        string[] parts = credentials.Split(':');
        
        if (parts.Length != 2)
        {
            return Task.FromResult(false);
        }

        string username = parts[0];
        string password = parts[1];

        return Task.FromResult(username == _username && password == _password);
    }
}