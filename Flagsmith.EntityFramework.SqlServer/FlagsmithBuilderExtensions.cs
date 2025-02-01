using Flagsmith.EntityFramework.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Flagsmith.EntityFramework.SqlServer;

public static class FlagsmithBuilderExtensions
{
    public static void UseSqlServer(this EntityFrameworkFlagsmithBuilder builder, string connectionString)
    {
        builder.Services.AddDbContext<FlagsmithDbContext>(
            options =>
                options.UseSqlServer(connectionString, b => b.MigrationsAssembly("Flagsmith.EntityFramework.SqlServer")));
    }
}