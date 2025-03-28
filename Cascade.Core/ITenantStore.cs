using Cascade.Core.Models;

namespace Cascade.Core;

public interface ITenantStore
{
    Task<IEnumerable<Tenant>> GetAllTenantsAsync();
}