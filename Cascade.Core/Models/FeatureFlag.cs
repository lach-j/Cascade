namespace Cascade.Core.Models;

public class FeatureFlag
{
    public string Id { get; set; }
    public string Name { get; set; }

    public string Description { get; set; } = "";
    public bool IsEnabled { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}