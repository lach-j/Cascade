namespace Cascade.Core.Models;

public class TenantState
{
    public string TenantId { get; set; }
    public bool IsEnabled { get; set; }
    public bool Override { get; set; }
}