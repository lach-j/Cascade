namespace Flagsmith.Core;

public class FeatureToggleService : IFeatureToggleService
{
    private readonly IFeatureStore _featureStore;
    private readonly IFeatureIdProvider _idProvider;

    public FeatureToggleService(IFeatureStore featureStore, IFeatureIdProvider idProvider)
    {
        _featureStore = featureStore;
        _idProvider = idProvider;
    }

    public async Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync()
    {
        return await _featureStore.GetAllFeaturesAsync();
    }

    public async Task<IEnumerable<TenantState>> GetTenantStateByFeature(string featureId)
    {
        var feature = await _featureStore.GetFeature(featureId);
        if (feature is null) return [];
        
        var tenants = await _featureStore.GetAllTenantsAsync();
        var overrides = await _featureStore.GetFeatureTenantOverridesAsync(featureId);

        var overridesHash = overrides.ToDictionary(x => x.Tenant.Id);
        return tenants.Select(
            x => new TenantState()
            {
                TenantId = x.Id,
                Override = overridesHash.ContainsKey(x.Id),
                IsEnabled = overridesHash.TryGetValue(x.Id, out var value) ? value.Enabled : feature.IsEnabled,
            });
    }

    public Task<FeatureFlag?> GetFeature(string featureId)
    {
        return _featureStore.GetFeature(featureId);
    }

    public async Task<IEnumerable<string>> GetAvailableFeatureIds()
    {
        var existingFeatures = (await _featureStore.GetAllFeaturesAsync()).Select(x => x.Id).ToHashSet();
        return _idProvider.GetFeatureIds().Where(x => !existingFeatures.Contains(x));
    }

    public async Task UpdateFeatureAsync(string featureKey, bool enabled, long tenantId = default)
    {
        await _featureStore.UpdateFeatureAsync(featureKey, enabled, tenantId);
    }

    public async Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        return await _featureStore.GetAllTenantsAsync();
    }

    public async Task<bool> IsEnabledAsync(string featureKey, long tenantId = default)
    {
        var flag = await _featureStore.GetFeature(featureKey);
        return flag?.IsEnabled ?? false;
    }
}