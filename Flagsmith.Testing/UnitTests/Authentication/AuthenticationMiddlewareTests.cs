using Flagsmith.Core;
using Flagsmith.Core.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Flagsmith.Testing.UnitTests.Authentication;

public class AuthenticationMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_WhenRequireAuthenticationIsFalse_CallsNext()
    {
        // Arrange
        var next = new RequestDelegate(_ => Task.CompletedTask);
        var middleware = new FlagsmithAuthenticationMiddleware(next);
        var context = new DefaultHttpContext();
        var serviceProvider = new ServiceCollection().BuildServiceProvider();
        var options = new FlagsmithOptions { RequireAuthentication = false };

        // Act
        await middleware.InvokeAsync(context, serviceProvider, options);

        // Assert
        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
    }
    
    [Fact]
    public async Task InvokeAsync_WhenRequireAuthenticationIsTrueAndNoAuthProvider_ReturnsInternalServerError()
    {
        // Arrange
        var next = new RequestDelegate(_ => Task.CompletedTask);
        var middleware = new FlagsmithAuthenticationMiddleware(next);
        var context = new DefaultHttpContext();
        var serviceProvider = new ServiceCollection().BuildServiceProvider();
        var options = new FlagsmithOptions { RequireAuthentication = true };

        // Act
        await middleware.InvokeAsync(context, serviceProvider, options);

        // Assert
        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);
    }
    
    [Fact]
    public async Task InvokeAsync_WhenRequireAuthenticationIsTrueAndAuthProviderReturnsTrue_CallsNext()
    {
        // Arrange
        var next = new RequestDelegate(_ => Task.CompletedTask);
        var middleware = new FlagsmithAuthenticationMiddleware(next);
        var context = new DefaultHttpContext();
        var serviceProvider = new ServiceCollection()
            .AddSingleton<IAuthenticationProvider>(new BasicAuthenticationProvider("username", "password"))
            .BuildServiceProvider();
        var options = new FlagsmithOptions { RequireAuthentication = true };

        context.Request.Headers["Authorization"] = "Basic " + Convert.ToBase64String("username:password"u8.ToArray());

        // Act
        await middleware.InvokeAsync(context, serviceProvider, options);

        // Assert
        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
    }
    
    [Fact]
    public async Task InvokeAsync_WhenRequireAuthenticationIsTrueAndAuthProviderReturnsFalse_ReturnsUnauthorized()
    {
        // Arrange
        var next = new RequestDelegate(_ => Task.CompletedTask);
        var middleware = new FlagsmithAuthenticationMiddleware(next);
        var context = new DefaultHttpContext();
        var serviceProvider = new ServiceCollection()
            .AddSingleton<IAuthenticationProvider>(new BasicAuthenticationProvider("username", "password"))
            .BuildServiceProvider();
        
        var options = new FlagsmithOptions { RequireAuthentication = true };

        context.Request.Headers.Authorization = "Basic " + Convert.ToBase64String("invalid:invalid"u8.ToArray());

        // Act
        await middleware.InvokeAsync(context, serviceProvider, options);

        // Assert
        Assert.Equal(StatusCodes.Status401Unauthorized, context.Response.StatusCode);
    }
}