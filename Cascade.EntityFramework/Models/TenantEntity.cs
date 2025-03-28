namespace Cascade.EntityFramework.Models;

public class TenantEntity
{
    public long Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<TenantOverrideEntity> FeatureOverrides { get; set; }
}