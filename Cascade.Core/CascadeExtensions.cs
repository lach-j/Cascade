using Cascade.Core.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Cascade.Core;

using Microsoft.Extensions.DependencyInjection;

public static class CascadeExtensions
{
    public static IServiceCollection AddCascade(
        this IServiceCollection services,
        Action<CascadeBuilder> configure,
        Action<CascadeOptions>? optionsActions = null)
    {
        var options = new CascadeOptions();
        optionsActions?.Invoke(options);
        
        // Register core services first
        services.AddScoped<IFeatureToggleService, FeatureToggleService>();
        
        // Then configure additional services
        var builder = new CascadeBuilder(services);
        configure(builder);

        options.RequireAuthentication = builder.UsesAuthentication;

        services.AddSingleton(options);
        
        if (!builder.FeatureIdProviderConfigured)
        {
            builder.RegisterFeatureIdProvider<DefaultFeatureIdProvider>(default);
        }

        return services;
    }

    public static IApplicationBuilder UseCascade(
        this IApplicationBuilder app)
    {
        var options = app.ApplicationServices.GetRequiredService<CascadeOptions>();

        if (options.EnableDashboard)
        {
            app.Map(
                options.DashboardPath,
                builder =>
                {
                    builder.UseRouting();
                    builder.UseMiddleware<CascadeAuthenticationMiddleware>();
                    builder.UseEndpoints(
                        endpoints =>
                        {
                            var api = endpoints.MapGroup("/api");

                            api.MapGet(
                                "/feature-flags",
                                async ([FromServices] IFeatureToggleService service) =>
                                {
                                    var features = await service.GetAllFeaturesAsync();

                                    var featureStates = new List<object>();

                                    foreach (var feature in features)
                                    {
                                        var tenants = await service.GetTenantStateByFeature(feature.Id);
                                        featureStates.Add(
                                            new
                                            {
                                                Feature = feature,
                                                TenantStates = tenants,
                                            });
                                    }

                                    return featureStates;
                                });
                            api.MapGet(
                                "/feature-flags/{featureId}",
                                async (string featureId, [FromServices] IFeatureToggleService service) =>
                                {
                                    var feature = await service.GetFeature(featureId);
                                    var tenants = await service.GetTenantStateByFeature(featureId);
                                    return new
                                    {
                                        Feature = feature,
                                        TenantStates = tenants,
                                    };
                                });

                            api.MapGet(
                                "/available-ids",
                                async ([FromServices] IFeatureToggleService service) => await service.GetAvailableFeatureIds());
                            api.MapGet("/known-ids", ([FromServices] IFeatureToggleService service) => service.GetAllFeatureIds());

                            api.MapPatch(
                                "/feature-flags/{featureId}",
                                async (
                                    string featureId,
                                    [FromQuery(Name = "tenantId")] string? tenantId,
                                    [FromQuery(Name = "enabled")] bool enabled,
                                    [FromServices] IFeatureToggleService service) =>
                                {
                                    await service.UpdateFeatureAsync(featureId, enabled, tenantId);
                                });


                            api.MapGet(
                                "/tenants",
                                async ([FromServices] IFeatureToggleService service) => await service.GetAllTenantsAsync());

                            api.MapDelete(
                                "/tenants/{tenantId}/overrides/{featureId}",
                                async (string tenantId, string featureId, [FromServices] IFeatureToggleService service) =>
                                    await service.ToggleOverride(featureId, tenantId));

                            api.MapPost(
                                "/management/bulk-create-missing",
                                async ([FromServices] IFeatureToggleService service) => { await service.BulkCreateMissing(); });

                            api.MapFallback(() => Results.NotFound());
                        });

                    builder.UseMiddleware<CascadeDashboardMiddleware>();
                });
        }

        if (options.CreateMissingFeaturesOnStart)
        {
            try
            {
                using var scope = app.ApplicationServices.CreateScope();
                var services = scope.ServiceProvider.GetRequiredService<IFeatureToggleService>();
                services.BulkCreateMissing().GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to created missing features: {ex}");
            }
        }

        return app;
    }
}

public class CascadeOptions
{
    public bool EnableDashboard { get; set; } = true;

    public string DashboardPath { get; set; } = "/Cascade";

    public bool CreateMissingFeaturesOnStart = false;
    
    public bool RequireAuthentication { get; set; } = false;
    
    public bool EnableDevServer { get; set; } = false;
}

public class CascadeBuilder
{
    public readonly IServiceCollection Services;

    public bool FeatureIdProviderConfigured { get; private set; }

    public bool HasCustomTenantStore { get; private set; }
    
    public bool UsesAuthentication { get; private set; }

    public CascadeBuilder(IServiceCollection services)
    {
        Services = services;
    }

    public CascadeBuilder RegisterFeatureIdProvider<T>(Func<IServiceProvider, T>? implementation)
        where T : class, IFeatureIdProvider
    {
        if (implementation != default)
        {
            Services.AddScoped<IFeatureIdProvider>(implementation);
        }
        else
        {
            Services.AddScoped<IFeatureIdProvider, T>();
        }

        FeatureIdProviderConfigured = true;

        return this;
    }

    public CascadeBuilder RegisterCustomTenantStore<T>(Func<IServiceProvider, T>? implementation)
        where T : class, ITenantStore
    {
        if (implementation != default)
        {
            Services.AddScoped<ITenantStore>(implementation);
        }
        else
        {
            Services.AddScoped<ITenantStore, T>();
        }

        HasCustomTenantStore = true;

        return this;
    }
    
    public CascadeBuilder RegisterAuthenticationProvider<T>(Func<IServiceProvider, T>? implementation)
        where T : class, IAuthenticationProvider
    {
        if (implementation != default)
        {
            Services.AddScoped<IAuthenticationProvider>(implementation);
        }
        else
        {
            Services.AddScoped<IAuthenticationProvider, T>();
        }

        UsesAuthentication = true;

        return this;
    }
}

public interface IFeatureIdProvider
{
    IEnumerable<string> GetFeatureIds();
}

public class DefaultFeatureIdProvider : IFeatureIdProvider
{
    public IEnumerable<string> GetFeatureIds()
    {
        return [];
    }
}