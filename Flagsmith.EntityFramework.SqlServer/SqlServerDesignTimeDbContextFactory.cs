using Flagsmith.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Flagsmith.EntityFramework.SqlServer;

public class SqlServerDesignTimeDbContextFactory : IDesignTimeDbContextFactory<FlagsmithDbContext>
{
    public FlagsmithDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FlagsmithDbContext>();
        optionsBuilder.UseSqlServer(args[0], b => b.MigrationsAssembly("Flagsmith.EntityFramework.SqlServer"));
        return new FlagsmithDbContext(optionsBuilder.Options);
    }
}