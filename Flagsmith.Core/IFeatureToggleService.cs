namespace Flagsmith.Core;

public interface IFeatureToggleService
{
    Task<IEnumerable<FeatureFlag>> GetAllFeaturesAsync();
    Task<IEnumerable<TenantState>> GetTenantStateByFeature(string featureId);
    Task<FeatureFlag?> GetFeature(string featureId);
    Task<IEnumerable<string>> GetAvailableFeatureIds();


    Task UpdateFeatureAsync(string featureKey, bool enabled, string? tenantId = default);

    Task<IEnumerable<Tenant>> GetAllTenantsAsync();

    Task<bool> IsEnabledAsync(string featureKey, string? tenantId = default);

    Task ToggleOverride(string featureKey, string tenantId);

    Task BulkCreateMissing();
}

public class TenantState
{
    public string TenantId { get; set; }
    public bool IsEnabled { get; set; }
    public bool Override { get; set; }
}

public class FeatureFlag
{
    public string Id { get; set; }
    public string Name { get; set; }

    public string Description { get; set; } = "";
    public bool IsEnabled { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Tenant
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string? Url { get; set; }
}

public class TenantOverride
{
    public string TenantId { get; set; }
    public bool Enabled { get; set; }
}