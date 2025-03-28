using Cascade.Core.Models;

namespace Cascade.Core;

public interface IFeatureToggleService
{
    Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync();
    Task<IEnumerable<TenantState>> GetTenantStateByFeature(string featureId);
    Task<FeatureFlag?> GetFeature(string featureId);
    Task<IEnumerable<string>> GetAvailableFeatureIds();
    IEnumerable<string> GetAllFeatureIds();


    Task UpdateFeatureAsync(string featureKey, bool enabled, string? tenantId = default);

    Task<IEnumerable<Tenant>> GetAllTenantsAsync();

    Task<bool> IsEnabledAsync(string featureKey, string? tenantId = default);

    Task ToggleOverride(string featureKey, string tenantId);

    Task BulkCreateMissing();
}