using System.Net;
using System.Text.RegularExpressions;

namespace Flagsmith.Core;

public class FlagsmithDashboardMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<FlagsmithDashboardMiddleware> _logger;
    private readonly FlagsmithOptions _options;
    private readonly IWebHostEnvironment _env;
    private readonly HttpClient _httpClient;
    
    private static readonly Dictionary<string, string> ContentTypes = new()
    {
        [".html"] = "text/html",
        [".js"] = "application/javascript",
        [".css"] = "text/css",
        [".ico"] = "image/x-icon",
        [".png"] = "image/png",
        [".svg"] = "image/svg+xml"
    };

    public FlagsmithDashboardMiddleware(
        RequestDelegate next,
        ILogger<FlagsmithDashboardMiddleware> logger,
        FlagsmithOptions options,
        IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _options = options;
        _env = env;
        _httpClient = new HttpClient();
    }

    public async Task InvokeAsync(HttpContext context, IFeatureToggleService featureService)
    {
        if (_env.IsDevelopment())
        {
            await ProxyToDevServer(context);
            return;
        }

        await ServeEmbeddedResource(context);
    }

    private async Task ProxyToDevServer(HttpContext context)
    {
        var dashboardPath = _options.DashboardPath;
        try
        {
            var path = context.Request.Path.Value!;
            var targetPath = path.StartsWith(dashboardPath) 
                ? path.Replace(dashboardPath, "") 
                : path;

            if (targetPath != "")
            {
                targetPath = $"{dashboardPath}{targetPath}";
            }
            
            var targetUri = new Uri($"http://localhost:5173{targetPath}{context.Request.QueryString}");
            
            _logger.LogInformation("Proxying request to: {TargetUri}", targetUri);

            var requestMessage = new HttpRequestMessage();
            requestMessage.RequestUri = targetUri;
            requestMessage.Method = new HttpMethod(context.Request.Method);

            // Copy request headers
            foreach (var header in context.Request.Headers)
            {
                if (!header.Key.Equals("Host", StringComparison.OrdinalIgnoreCase) &&
                    !header.Key.Equals("Connection", StringComparison.OrdinalIgnoreCase))
                {
                    requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                }
            }

            // Handle request body if present
            if (context.Request.Body != null && context.Request.ContentLength > 0)
            {
                var streamContent = new StreamContent(context.Request.Body);
                requestMessage.Content = streamContent;
            }

            using var responseMessage = await _httpClient.SendAsync(
                requestMessage,
                HttpCompletionOption.ResponseHeadersRead);

            context.Response.StatusCode = (int)responseMessage.StatusCode;

            // Don't try to copy content for 304 responses
            if (responseMessage.StatusCode == HttpStatusCode.NotModified)
            {
                return;
            }

            // Copy response headers before writing to the body
            foreach (var header in responseMessage.Headers)
            {
                if (!header.Key.Equals("Connection", StringComparison.OrdinalIgnoreCase) &&
                    !header.Key.Equals("Transfer-Encoding", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.Headers[header.Key] = header.Value.ToArray();
                }
            }

            if (responseMessage.Content != null)
            {
                foreach (var header in responseMessage.Content.Headers)
                {
                    context.Response.Headers[header.Key] = header.Value.ToArray();
                }

                await responseMessage.Content.CopyToAsync(context.Response.Body);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error proxying to dev server");
            
            // Only set status code and write error if headers haven't been sent
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsJsonAsync(new { error = "Dev server not available" });
            }
        }
    }

    private async Task ServeEmbeddedResource(HttpContext context)
    {
        var path = context.Request.Path.Value!.Replace(_options.DashboardPath, "");

        
        var assembly = typeof(FlagsmithDashboardMiddleware).Assembly;
        var requestPath = path == "/" ? "/index.html" : path;
        var resourcePath = $"Flagsmith.Core.Dashboard{requestPath.Replace('/', '.')}";
        var extension = Path.GetExtension(requestPath);

        using var stream = assembly.GetManifestResourceStream(resourcePath);
        if (stream == null)
        {
            var fallbackStream = assembly.GetManifestResourceStream("Flagsmith.Core.Dashboard.index.html");
            if (fallbackStream == null)
            {
                context.Response.StatusCode = 404;
                return;
            }
            
            context.Response.ContentType = ContentTypes[".html"];
            await fallbackStream.CopyToAsync(context.Response.Body);
            return;
        }

        context.Response.ContentType = ContentTypes.GetValueOrDefault(extension, "application/octet-stream");
        await stream.CopyToAsync(context.Response.Body);
    }
}