namespace Flagsmith.EntityFramework.Models;

public class FeatureFlagEntity
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public virtual ICollection<TenantOverrideEntity> TenantOverrides { get; set; }
}
