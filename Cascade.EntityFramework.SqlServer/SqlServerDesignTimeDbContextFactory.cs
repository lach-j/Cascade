using Cascade.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Cascade.EntityFramework.SqlServer;

public class SqlServerDesignTimeDbContextFactory : IDesignTimeDbContextFactory<CascadeDbContext>
{
    public CascadeDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CascadeDbContext>();
        optionsBuilder.UseSqlServer(args[0], b => b.MigrationsAssembly("Cascade.EntityFramework.SqlServer"));
        return new CascadeDbContext(optionsBuilder.Options);
    }
}