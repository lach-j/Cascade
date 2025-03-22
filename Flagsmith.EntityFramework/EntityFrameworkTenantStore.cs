using Flagsmith.Core;
using Flagsmith.Core.Models;
using Flagsmith.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;

namespace Flagsmith.EntityFramework;

public class EntityFrameworkTenantStore : ITenantStore
{

    private readonly FlagsmithDbContext _context;
    
    public async Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        var tenants = await _context.Tenants
            .Include(t => t.FeatureOverrides)
            .ToListAsync();

        return tenants.Select(x => x.MapToTenant());
    }
}