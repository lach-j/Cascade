using Flagsmith.Core;
using Flagsmith.Core.Models;
using Flagsmith.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;

namespace Flagsmith.EntityFramework;

public class EntityFrameworkFeatureStore : IFeatureStore
{
    private readonly FlagsmithDbContext _context;

    public EntityFrameworkFeatureStore(FlagsmithDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync()
    {
        var features = await _context.Features
            .Include(f => f.TenantOverrides)
            .ToListAsync();

        return features.Select(x => x.MapToFeatureFlag());
    }
    
    public async Task<IEnumerable<TenantOverride>> GetFeatureTenantOverridesAsync(string featureId)
    {
        var overrides = _context.TenantOverrides.Where(x => x.FeatureId == featureId);
        return (await overrides.ToListAsync()).Select(x => x.MapToTenantOverride());
    }

    public async Task DeleteFeatureTenantOverrideAsync(string featureId, string tenantId)
    {
        var overrideToDelete = await _context.TenantOverrides.FirstOrDefaultAsync(to => to.FeatureId == featureId && to.TenantId == tenantId);
        if (overrideToDelete is null) return;
        _context.TenantOverrides.Remove(overrideToDelete);

        await _context.SaveChangesAsync();
    }

    public async Task AddFeatureTenantOverrideAsync(string featureId, string tenantId, bool enabled)
    {
        var existingOverride = await _context.TenantOverrides.FirstOrDefaultAsync(to => to.FeatureId == featureId && to.TenantId == tenantId);
        if (existingOverride is not null)
        {
            existingOverride.IsEnabled = enabled;
            existingOverride.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            _context.TenantOverrides.Add(
                new TenantOverrideEntity()
                {
                    FeatureId = featureId,
                    TenantId = tenantId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsEnabled = enabled,
                });
        }

        await _context.SaveChangesAsync();
    }

    public async Task CreateFeatureAsync(FeatureFlag flag)
    {
        var entity = new FeatureFlagEntity()
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Id = flag.Id,
            Description = flag.Description,
            Name = flag.Name,
            IsEnabled = flag.IsEnabled,
        };
        _context.Features.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateFeatureAsync(string featureKey, bool enabled, string? tenantId = default)
    {
        var feature = await _context.Features.FindAsync(featureKey);
        if (feature is null) return;

        if (tenantId != default)
        {
            var tenantOverride = await _context.TenantOverrides
                .FirstOrDefaultAsync(to => to.FeatureId == featureKey && to.TenantId == tenantId);

            var requiresOverride = tenantOverride is null && feature.IsEnabled != enabled;
            if (requiresOverride)
            {
                tenantOverride = new TenantOverrideEntity
                {
                    FeatureId = featureKey,
                    TenantId = tenantId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.TenantOverrides.Add(tenantOverride);
            }

            if (tenantOverride != null)
            {
                tenantOverride.IsEnabled = enabled;
                tenantOverride.UpdatedAt = DateTime.UtcNow;
            }
        }
        else
        {
            feature.IsEnabled = enabled;
            feature.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }
    
    public async Task<FeatureFlag?> GetFeature(string featureKey)
    {
        var entity = await _context.Features.FirstOrDefaultAsync(f => f.Id == featureKey);
        return entity is null ? default : entity.MapToFeatureFlag();
    }
}