using Cascade.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Cascade.EntityFramework.SqlServer;

public static class CascadeBuilderExtensions
{
    public static void UseSqlServer(this EntityFrameworkCascadeBuilder builder, string connectionString)
    {
        builder.Services.AddDbContext<CascadeDbContext>(
            options =>
                options.UseSqlServer(connectionString, b => b.MigrationsAssembly("Cascade.EntityFramework.SqlServer")));
    }
}