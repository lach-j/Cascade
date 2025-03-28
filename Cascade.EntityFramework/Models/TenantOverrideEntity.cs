namespace Cascade.EntityFramework.Models;

public class TenantOverrideEntity
{
    public string FeatureId { get; set; }
    public string TenantId { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public virtual FeatureFlagEntity Feature { get; set; }
}