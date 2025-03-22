using Flagsmith.Core.Models;
using Humanizer;

namespace Flagsmith.Core;

public class FeatureToggleService : IFeatureToggleService
{
    private readonly IFeatureStore _featureStore;
    private readonly IFeatureIdProvider _idProvider;
    private readonly ITenantStore _tenantStore;

    public FeatureToggleService(IFeatureStore featureStore, IFeatureIdProvider idProvider, ITenantStore tenantStore)
    {
        _featureStore = featureStore;
        _idProvider = idProvider;
        _tenantStore = tenantStore;
    }

    public async Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync()
    {
        return await _featureStore.GetAllFeaturesAsync();
    }

    public async Task<IEnumerable<TenantState>> GetTenantStateByFeature(string featureId)
    {
        var feature = await _featureStore.GetFeature(featureId);
        if (feature is null) return [];
        
        var tenants = await _tenantStore.GetAllTenantsAsync();
        var overrides = await _featureStore.GetFeatureTenantOverridesAsync(featureId);

        var overridesHash = overrides.ToDictionary(x => x.TenantId);
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

    public IEnumerable<string> GetAllFeatureIds()
    {
        return _idProvider.GetFeatureIds();
    }

    public async Task UpdateFeatureAsync(string featureKey, bool enabled, string? tenantId = default)
    {
        await _featureStore.UpdateFeatureAsync(featureKey, enabled, tenantId);
    }

    public async Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        return await _tenantStore.GetAllTenantsAsync();
    }

    public async Task<bool> IsEnabledAsync(string featureKey, string tenantId = default)
    {
        var flag = await _featureStore.GetFeature(featureKey);
        return flag?.IsEnabled ?? false;
    }

    public async Task ToggleOverride(string featureKey, string tenantId)
    {
        var feature = await _featureStore.GetFeature(featureKey);
        if (feature is null) return;

        var overrides = await _featureStore.GetFeatureTenantOverridesAsync(featureKey);
        var hasOverride = overrides.Any(x => x.TenantId == tenantId);

        if (hasOverride)
        {
            await _featureStore.DeleteFeatureTenantOverrideAsync(featureKey, tenantId);
        }
        else
        {
            await _featureStore.AddFeatureTenantOverrideAsync(featureKey, tenantId, feature.IsEnabled);
        }
    }

    public async Task BulkCreateMissing()
    {
        var featureIds = _idProvider.GetFeatureIds().ToHashSet();
        var features = (await _featureStore.GetAllFeaturesAsync()).ToDictionary(f => f.Id);

        var featuresToCreate = featureIds.Where(f => !features.ContainsKey(f));
        foreach (var feature in featuresToCreate)
        {
            var featureFlag = new FeatureFlag()
            {
                Id = feature,
                Name = feature.Humanize(LetterCasing.Title),
                IsEnabled = false,
            };
            await _featureStore.CreateFeatureAsync(featureFlag);
            
        }
    }
}