using Flagsmith.Core;
using Flagsmith.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;

namespace Flagsmith.EntityFramework;

public class EntityFrameworkFeatureStore : IFeatureStore
{
    private readonly FlagsmithDbContext _context;

    public EntityFrameworkFeatureStore(FlagsmithDbContext context, IFeatureIdProvider featureIdProvider)
    {
        _context = context;
    }

    public async Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync()
    {
        var features = await _context.Features
            .Include(f => f.TenantOverrides)
            .ToListAsync();

        return features.Select(MapToFeatureFlag);
    }

    public async Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        var tenants = await _context.Tenants
            .Include(t => t.FeatureOverrides)
            .ToListAsync();

        return tenants.Select(MapToTenant);
    }
    
    public async Task<IEnumerable<TenantOverride>> GetFeatureTenantOverridesAsync(string featureId)
    {
        var overrides = _context.TenantOverrides.Where(x => x.FeatureId == featureId);
        return (await overrides.ToListAsync()).Select(MapToTenantOverride);
    }

    public async Task UpdateFeatureAsync(string featureKey, bool enabled, long tenantId = default)
    {
        if (tenantId != default)
        {
            var @override = await _context.TenantOverrides
                .FirstOrDefaultAsync(to => to.FeatureId == featureKey && to.TenantId == tenantId);

            if (@override == null)
            {
                @override = new TenantOverrideEntity
                {
                    FeatureId = featureKey,
                    TenantId = tenantId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.TenantOverrides.Add(@override);
            }

            @override.IsEnabled = enabled;
            @override.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var feature = await _context.Features.FindAsync(featureKey);
            if (feature != null)
            {
                feature.IsEnabled = enabled;
                feature.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
    }

    private static FeatureFlag? MapToFeatureFlag(FeatureFlagEntity entity)
    {
        return new FeatureFlag
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            IsEnabled = entity.IsEnabled,
        };
    }

    private static Tenant MapToTenant(TenantEntity entity)
    {
        return new Tenant
        {
            Id = entity.Id,
            Name = entity.Name,
        };
    }
    
    private static TenantOverride MapToTenantOverride(TenantOverrideEntity entity)
    {
        return new TenantOverride()
        {
            Enabled = entity.IsEnabled,
            Tenant = MapToTenant(entity.Tenant),
        };
    }
    
    public async Task<FeatureFlag?> GetFeature(string featureKey)
    {
        var entity = await _context.Features.FirstOrDefaultAsync(f => f.Id == featureKey);
        return entity is null ? default : MapToFeatureFlag(entity);
    }
}