using Flagsmith.Core;
using Flagsmith.EntityFramework.Models;

namespace Flagsmith.EntityFramework;

public static class EntityExtensions
{
    public static FeatureFlag MapToFeatureFlag(this FeatureFlagEntity entity)
    {
        return new FeatureFlag
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            IsEnabled = entity.IsEnabled,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
        };
    }

    public static Tenant MapToTenant(this TenantEntity entity)
    {
        return new Tenant
        {
            Id = entity.Id.ToString(),
            Name = entity.Name,
        };
    }
    
    public static TenantOverride MapToTenantOverride(this TenantOverrideEntity entity)
    {
        return new TenantOverride()
        {
            Enabled = entity.IsEnabled,
            TenantId = entity.TenantId,
        };
    }
}