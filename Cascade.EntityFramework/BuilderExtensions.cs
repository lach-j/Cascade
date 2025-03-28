using Cascade.Core;
using Cascade.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Cascade.EntityFramework;

public class EntityFrameworkCascadeBuilder
{
    public IServiceCollection Services { get; }
    public EntityFrameworkCascadeBuilder(IServiceCollection serviceCollection)
    {
        Services = serviceCollection;
    }
}

public static class CascadeBuilderExtensions
{
    public static CascadeBuilder UseEntityFramework(this CascadeBuilder builder, Action<EntityFrameworkCascadeBuilder>? options = null)
    {
        builder.Services.AddScoped<IFeatureStore, EntityFrameworkFeatureStore>();

        if (!builder.HasCustomTenantStore)
        {
            builder.Services.AddScoped<ITenantStore, EntityFrameworkTenantStore>();
        }
        
        builder.Services.AddHostedService<DatabaseInitializer>();

        options?.Invoke(new EntityFrameworkCascadeBuilder(builder.Services));

        return builder;
    }
}