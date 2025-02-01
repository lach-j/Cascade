namespace Flagsmith.Core;

public interface IFeatureStore
{
    Task<FeatureFlag?> GetFeature(string featureKey);

    Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync();

    Task UpdateFeatureAsync(string featureKey, bool enabled, long tenantId = default);

    Task<IEnumerable<Tenant>> GetAllTenantsAsync();
    Task<IEnumerable<TenantOverride>> GetFeatureTenantOverridesAsync(string featureId);
}