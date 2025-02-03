namespace Flagsmith.Core;

public interface IFeatureStore
{
    Task<FeatureFlag?> GetFeature(string featureKey);

    Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync();

    Task UpdateFeatureAsync(string featureKey, bool enabled, string? tenantId = default);

    Task<IEnumerable<TenantOverride>> GetFeatureTenantOverridesAsync(string featureId);
    Task DeleteFeatureTenantOverrideAsync(string featureId, string tenantId);
    Task AddFeatureTenantOverrideAsync(string featureId, string tenantId, bool enabled);

    Task CreateFeatureAsync(FeatureFlag flag);
}