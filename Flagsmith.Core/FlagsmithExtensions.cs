using Microsoft.AspNetCore.Mvc;

namespace Flagsmith.Core;

using Microsoft.Extensions.DependencyInjection;
public static class FlagsmithExtensions
{
    public static IServiceCollection AddFlagsmith(
        this IServiceCollection services,
        Action<FlagsmithBuilder> configure, 
        Action<FlagsmithOptions>? optionsActions = null)
    {
        var options = new FlagsmithOptions();
        optionsActions?.Invoke(options);

        services.AddSingleton(options);
        
        // Register core services first
        services.AddScoped<IFeatureToggleService, FeatureToggleService>();
        
        // Then configure additional services
        var builder = new FlagsmithBuilder(services);
        configure(builder);

        if (!builder.FeatureIdProviderConfigured)
        {
            builder.RegisterFeatureIdProvider<DefaultFeatureIdProvider>(default);
        }
        
        return services;
    }

    public static IApplicationBuilder UseFlagsmith(
        this IApplicationBuilder app)
    {
        var options = app.ApplicationServices.GetRequiredService<FlagsmithOptions>();
        
        if (options.EnableDashboard)
        {
            app.Map(options.DashboardPath, builder =>
            {
                builder.UseRouting()
                    .UseEndpoints(endpoints =>
                    {
                        var api = endpoints.MapGroup("/api");

                        api.MapGet(
                            "/feature-flags",
                            async (IFeatureToggleService service) =>
                            {
                                var features = await service.GetAllFeaturesAsync();
                                
                                var featureStates = new List<object>();
                                
                                foreach (var feature in features)
                                {
                                    var tenants = await service.GetTenantStateByFeature(feature.Id);
                                    featureStates.Add(new
                                    {
                                        Feature = feature,
                                        TenantStates = tenants,
                                    });
                                }

                                return featureStates;

                            });
                            api.MapGet("/feature-flags/{featureId}", async (string featureId, IFeatureToggleService service) =>
                            {
                                var feature = await service.GetFeature(featureId);
                                var tenants = await service.GetTenantStateByFeature(featureId);
                                return new
                                {
                                    Feature = feature,
                                    TenantStates = tenants,
                                };
                            });
                            
                            api.MapGet("/available-ids", async (IFeatureToggleService service) => await service.GetAvailableFeatureIds());
                            
                            api.MapPatch(
                                "/feature-flags/{featureId}",
                                async (string featureId, [FromQuery(Name = "tenantId")] long tenantId, [FromQuery(Name = "enabled")] bool enabled, IFeatureToggleService service) =>
                                {
                                    await service.UpdateFeatureAsync(featureId, enabled, tenantId);
                                });
                            

                            api.MapGet(
                                "/tenants",
                                async (IFeatureToggleService service) => await service.GetAllTenantsAsync());

                            api.MapFallback(() => Results.NotFound());
                    });

                builder.UseMiddleware<FlagsmithDashboardMiddleware>();
            });
        }

        return app;
    }
}

public class FlagsmithOptions
{
    public bool EnableDashboard { get; set; } = true;

    public string DashboardPath { get; set; } = "/flagsmith";

    public bool RequireAuthentication { get; set; } = true;
    public string[] AllowedRoles { get; set; } = new[] { "Admin" };
}

public class FlagsmithBuilder
{
    public readonly IServiceCollection Services;
    public bool FeatureIdProviderConfigured { get; private set; }

    public FlagsmithBuilder(IServiceCollection services)
    {
        Services = services;
    }

    public FlagsmithBuilder RegisterFeatureIdProvider<T>(Func<IServiceProvider, T>? implementation) where T : class, IFeatureIdProvider
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