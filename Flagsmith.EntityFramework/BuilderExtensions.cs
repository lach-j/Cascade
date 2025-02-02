using Flagsmith.Core;
using Flagsmith.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Flagsmith.EntityFramework;

public class EntityFrameworkFlagsmithBuilder
{
    public IServiceCollection Services { get; }
    public EntityFrameworkFlagsmithBuilder(IServiceCollection serviceCollection)
    {
        Services = serviceCollection;
    }
}

public static class FlagsmithBuilderExtensions
{
    public static FlagsmithBuilder UseEntityFramework(this FlagsmithBuilder builder, Action<EntityFrameworkFlagsmithBuilder>? options = null)
    {
        builder.Services.AddScoped<IFeatureStore, EntityFrameworkFeatureStore>();

        if (!builder.HasCustomTenantStore)
        {
            builder.Services.AddScoped<ITenantStore, EntityFrameworkTenantStore>();
        }
        
        builder.Services.AddHostedService<DatabaseInitializer>();

        options?.Invoke(new EntityFrameworkFlagsmithBuilder(builder.Services));

        return builder;
    }
}