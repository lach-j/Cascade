using Cascade.Core;
using Cascade.Core.Models;
using Cascade.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;

namespace Cascade.EntityFramework;

public class EntityFrameworkTenantStore : ITenantStore
{

    private readonly CascadeDbContext _context;
    
    public async Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        var tenants = await _context.Tenants
            .Include(t => t.FeatureOverrides)
            .ToListAsync();

        return tenants.Select(x => x.MapToTenant());
    }
}