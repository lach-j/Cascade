using Flagsmith.Core.Authentication;
using Microsoft.AspNetCore.Http;

namespace Flagsmith.Testing.UnitTests.Authentication;

public class BasicAuthenticationProviderTests
{
    [Fact]
    public async Task AuthenticateAsync_WhenInvalidAuthorizationHeader_ReturnsFalse()
    {
        // Arrange
        var provider = new BasicAuthenticationProvider("username", "password");
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Invalid";

        // Act
        var result = await provider.AuthenticateAsync(context);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task AuthenticateAsync_WhenNoAuthorizationHeader_ReturnsFalse()
    {
        // Arrange
        var provider = new BasicAuthenticationProvider("username", "password");
        var context = new DefaultHttpContext();

        // Act
        var result = await provider.AuthenticateAsync(context);

        // Assert
        Assert.False(result);
    }
    
    [Fact]
    public async Task AuthenticateAsync_WhenInvalidFormat_ReturnsFalse()
    {
        // Arrange
        var provider = new BasicAuthenticationProvider("username", "password");
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = $"Basic {Convert.ToBase64String("invalid:invalid:invalid"u8.ToArray())}";

        // Act
        var result = await provider.AuthenticateAsync(context);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task AuthenticateAsync_WhenInvalidCredentials_ReturnsFalse()
    {
        // Arrange
        var provider = new BasicAuthenticationProvider("username", "password");
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Basic " + Convert.ToBase64String("invalid:invalid"u8.ToArray());

        // Act
        var result = await provider.AuthenticateAsync(context);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task AuthenticateAsync_WhenValidCredentials_ReturnsTrue()
    {
        // Arrange
        var provider = new BasicAuthenticationProvider("username", "password");
        var context = new DefaultHttpContext();
        context.Request.Headers["Authorization"] = "Basic " + Convert.ToBase64String("username:password"u8.ToArray());

        // Act
        var result = await provider.AuthenticateAsync(context);

        // Assert
        Assert.True(result);
    }
}