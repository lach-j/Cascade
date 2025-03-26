namespace Cascade.Core.Authentication;

public class CascadeAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public CascadeAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider, CascadeOptions options)
    {
        if (!options.RequireAuthentication)
        {
            await _next(context);
            return;
        }

        var authProvider = serviceProvider.GetService<IAuthenticationProvider>();
        
        if (authProvider is null)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            return;
        }

        if (await authProvider.AuthenticateAsync(context))
        {
            await _next(context);
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
    }
}